import {default as express} from 'express';
import {default as bodyParser} from 'body-parser';
import {default as pouchdb} from 'pouchdb';

import {httpRequest, httpForward} from './httpRequest';
import {parseRssJsObject} from './rssJsObjectParser';
import {parseXml} from './xmlParser';
import {sha256hash} from './sha256hash';
import {mergePropertiesFromObject} from 'objectMerger';

let app = express();
let pouch = new pouchdb('podcasts.pouchdb');

app.use(bodyParser.json());

// curl -H 'Accept: application/json' [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38/items/fa0054fda3144d0241c6a02824f3d94d81a6630b2ae2e1644f3d4ef3ca306e75
// curl -H 'Accept: audio/mpeg' [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38/items/fa0054fda3144d0241c6a02824f3d94d81a6630b2ae2e1644f3d4ef3ca306e75
app.get('/channels/:channelid/items/:itemid', (req, res) => {
  pouch.get(`items/${req.params.channelid}/${req.params.itemid}`).then(data => {
    if (req.accepts('json')) {
      res.send({
        ok: true,
        item: data
      });
    } else if (req.accepts('audio/mpeg')) {
      httpForward(data.enclosure.url, res);
    } else {
      res.status(406).end();
    }
  }).catch(error => {
    res.send({error: error.toString()});
  });
});

// curl [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38/items
app.get('/channels/:channelid/items', (req, res) => {
  pouch.allDocs({
    include_docs: true,
    startkey: `items/${req.params.channelid}/`,
    endkey: `items/${req.params.channelid}/\ufff0`
  }).then(data => {
    res.send({
      ok: true,
      items: data.rows.map(row => {
        return row.doc;
      })
    });
  }).catch(error => {
    res.send({error: error.toString()});
  });
});

// curl [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38
app.get('/channels/:channelid', (req, res) => {
  pouch.get(`channels/${req.params.channelid}`).then(data => {
    res.send({
      ok: true,
      channel: data
    });
  }).catch(error => {
    res.send({error: error.toString()});
  });
});

// curl [::1]:8888/channels
app.get('/channels', (req, res) => {
  pouch.allDocs({
    include_docs: true,
    startkey: 'channels/',
    endkey: 'channels/\ufff0'
  }).then(data => {
    res.send({
      ok: true,
      channels: data.rows.map(row => {
        return row.doc;
      })
    });
  }).catch(error => {
    res.send({error: error.toString()});
  });
});

// create a new channel
// curl -H "content-type: application/json" -d '{"url": "http://sixgun.org/feed/gnr"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "http://www.cbc.ca/podcasting/includes/spark.xml"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "https://rss.art19.com/talking-machines"}' [::1]:8888/channels
app.post('/channels', (req, res) => {
  let url = req.body.url;

  addOrUpdateChannelFromUrl(url).catch(error => {
    res.send({error: error.toString()});
  });
});

app.listen(8888, () => {
  console.log('listening on http://[::1]:8888');
});

function addOrUpdateChannelFromUrl(url) {
  return httpRequest(url).then(data => {
    return parseXml(data);
  }).then(data => {
    let obj = parseRssJsObject(data);
    let id = sha256hash(url);
    let channel = {
      _id: `channels/${id}`,
      id: id,
      title: obj.title,
      description: obj.description,
      url: url
    };

    return pouch.put(channel).catch(error => {
      if (error.status != 409) {
        return new Promise((resolve, reject) => { reject(error); });
      }

      return pouch.get(channel._id).then(chan => {
        if (mergePropertiesFromObject(chan, ['title', 'description'], channel)) {
          return pouch.put(chan);
        }
      });
    }).then(() => {
      return Promise.all(obj.items.map(itm => {
        let id = sha256hash(itm.guid);
        let newItm = {
          _id: `items/${channel.id}/${id}`,
          id: id,
          title: itm.title,
          enclosure: itm.enclosure
        };

        return pouch.put(newItm).catch(error => {
          if (error.status != 409) {
            return new Promise((resolve, reject) => { reject(error); });
          }

          return pouch.get(newItm._id).then(exItem => {
            if (mergePropertiesFromObject(exItem, ['title', 'enclosure'], newItm)) {
              return pouch.put(exItem);
            }
          });
        });
      }));
    }).then(() => {
      res.send({
        ok: true,
        id: id
      });
    });
  });
}
