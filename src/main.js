import {default as timer} from 'timers';
import {default as express} from 'express';
import {default as bodyParser} from 'body-parser';
import {default as pouchdb} from 'pouchdb';

import {httpRequest, httpForward} from './httpRequest';
import {parseRssJsObject} from './rssJsObjectParser';
import {parseXml} from './xmlParser';
import {sha256hash} from './sha256hash';
import {mergePropertiesFromObject} from './objectMerger';
import {deleteInternalKeys, consoleLog} from './utils';

let app = express();
let pouch = new pouchdb('podcasts.pouchdb');

app.use(bodyParser.json());

// curl -H 'Accept: application/json' [::1]:8888/channels/7b9fe424014d93d9cc2cb83ae5cd0b63323e8739b1576b1bd055cef12990dc8a/items/e232d8d4ca4ab5f9fcaa3f1f34a560d69a86eb69df31e535fa64ae90f548899b
// curl -H 'Accept: audio/mpeg' [::1]:8888/channels/7b9fe424014d93d9cc2cb83ae5cd0b63323e8739b1576b1bd055cef12990dc8a/items/e232d8d4ca4ab5f9fcaa3f1f34a560d69a86eb69df31e535fa64ae90f548899b
// curl --head -H 'Accept: audio/mpeg' [::1]:8888/channels/ef1ddf81979ca4d13469072501c6de35503655c3fa8d6f8184acc28dbf2a5442/items/ff932769a9a9e25d3f76fa40a542341432f30344e0133ff1ec85ed7fe3a7d0a9
// curl --head -H 'Accept: audio/mpeg' [::1]:8888/channels/7b9fe424014d93d9cc2cb83ae5cd0b63323e8739b1576b1bd055cef12990dc8a/items/e232d8d4ca4ab5f9fcaa3f1f34a560d69a86eb69df31e535fa64ae90f548899b
app.head('/channels/:channelid/items/:itemid', (req, res) => {
  pouch.get(`items/${req.params.channelid}/${req.params.itemid}`).then(data => {
    if (req.accepts('audio/mpeg')) {
      return httpForward(data.enclosure.url, 'HEAD', res);
    } else {
      res.status(406).end();

      return Promise.resolve();
    }
  }).catch(error => {
    consoleLog(error);
    res.send({error: error.toString()});
  });
});

// curl -H 'Accept: application/json' [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38/items/fa0054fda3144d0241c6a02824f3d94d81a6630b2ae2e1644f3d4ef3ca306e75
// curl -H 'Accept: audio/mpeg' [::1]:8888/channels/ef1ddf81979ca4d13469072501c6de35503655c3fa8d6f8184acc28dbf2a5442/items/ff932769a9a9e25d3f76fa40a542341432f30344e0133ff1ec85ed7fe3a7d0a9
// curl -H 'Accept: audio/mpeg' [::1]:8888/channels/1a958cbe49b7f8a642feec0d0b1336ea25cb3fcb28a15e969f371a7706700e7e/items/e7fe57aff66c5de95fdd8d2d9dab3a7d8e8cff4a08f6efd3435e7016450387d1
// curl -H 'Accept: audio/mpeg' [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38/items/fa0054fda3144d0241c6a02824f3d94d81a6630b2ae2e1644f3d4ef3ca306e75
// curl -H 'Accept: audio/mpeg' [::1]:8888/channels/ab24644cd94f1596831c2e4912806c48df114eb55db72b0c505e6ed799591198/items/3cf5f9b68aa309bde780e6818d3e6b3e221f90ca61cd3661331525d3ec18d258
app.get('/channels/:channelid/items/:itemid', (req, res) => {
  pouch.get(`items/${req.params.channelid}/${req.params.itemid}`).then(data => {
    if (req.accepts('json')) {
      res.send({
        ok: true,
        item: deleteInternalKeys(data)
      });
      return Promise.resolve();
    } else if (req.accepts('audio/mpeg')) {
      return httpForward(data.enclosure.url, 'GET', res);
    } else {
      res.status(406).end();

      return Promise.resolve();
    }
  }).catch(error => {
    consoleLog(error);
    res.send({error: error.toString()});
  });
});

// curl [::1]:8888/channels/ef1ddf81979ca4d13469072501c6de35503655c3fa8d6f8184acc28dbf2a5442/items
// curl [::1]:8888/channels/1a958cbe49b7f8a642feec0d0b1336ea25cb3fcb28a15e969f371a7706700e7e/items
// curl [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38/items
app.get('/channels/:channelid/items', (req, res) => {
  consoleLog(`getting items for channel with id '${req.params.channelid}'`);
  pouch.allDocs({
    include_docs: true,
    startkey: `items/${req.params.channelid}/`,
    endkey: `items/${req.params.channelid}/\ufff0`
  }).then(data => {
    consoleLog(`got ${data.rows.length} items for channel with id '${req.params.channelid}'`);
    res.send({
      ok: true,
      items: data.rows.map(row => {
        return deleteInternalKeys(row.doc);
      })
    });
  }).catch(error => {
    consoleLog(error);
    res.send({error: error.toString()});
  });
});

// curl [::1]:8888/channels/7107621ce28a789b44362a5f12ee7c5e9b068adf4e7b1b139cfd6d6927f07f38
app.get('/channels/:channelid', (req, res) => {
  consoleLog(`getting channel with id '${req.params.channelid}'`);
  pouch.get(`channels/${req.params.channelid}`).then(data => {
    consoleLog(`got channel with id '${req.params.channelid}'`);
    res.send({
      ok: true,
      channel: deleteInternalKeys(data)
    });
  }).catch(error => {
    consoleLog(error);
    res.send({error: error.toString()});
  });
});

// curl [::1]:8888/channels
app.get('/channels', (req, res) => {
  consoleLog(`getting channels`);
  pouch.allDocs({
    include_docs: true,
    startkey: 'channels/',
    endkey: 'channels/\ufff0'
  }).then(data => {
    consoleLog(`got ${data.rows.length} channels`);
    res.send({
      ok: true,
      channels: data.rows.map(row => {
        return deleteInternalKeys(row.doc);
      })
    });
  }).catch(error => {
    consoleLog(error);
    res.send({error: error.toString()});
  });
});

// create a new channel
// curl -H "content-type: application/json" -d '{"url": "https://concerning.ai/feed/"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "http://lineardigressions.com/episodes?format=RSS"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "http://sixgun.org/feed/gnr"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "http://www.cbc.ca/podcasting/includes/spark.xml"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "https://rss.art19.com/talking-machines"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "http://www.quickanddirtytips.com/xml/getitdone.xml"}' [::1]:8888/channels
// curl -H "content-type: application/json" -d '{"url": "https://makingembeddedsystems.libsyn.com/rss"}' [::1]:8888/channels
app.post('/channels', (req, res) => {
  consoleLog(`adding channel at URL '${req.body.url}'`);
  let url = req.body.url;

  addOrUpdateChannelFromUrl(url).then(() => {
    consoleLog(`channel at URL '${url}' added`);
    res.send({
      ok: true,
      id: sha256hash(url)
    });
  }).catch(error => {
    consoleLog(error);
    res.send({error: error.toString()});
  });
});

app.listen(8888, () => {
  consoleLog('listening on http://[::1]:8888');
});

timer.setInterval(() => {
  pouch.allDocs({
    include_docs: true,
    startkey: 'channels/',
    endkey: 'channels/\ufff0'
  }).then(data => {
    return Promise.all(data.rows.map(row => {
      return addOrUpdateChannelFromUrl(row.doc.url).catch(error => {
        consoleLog(`error updating ${row.doc.url}: ${error}`);

        return Promise.resolve();
      });
    }));
  }).catch(error => {
    consoleLog(`error updating feeds: ${error}`);
  });
}, 1000 * 3600 * 12);

function addOrUpdateChannelFromUrl(url) {
  return httpRequest(url).then(data => {
    return parseXml(data);
  }).then(data => {
    try {
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
          return Promise.reject(error);
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
            date: itm.date,
            enclosure: itm.enclosure
          };

          return pouch.put(newItm).catch(error => {
            if (error.status != 409) {
              return Promise.reject(error);
            }

            return pouch.get(newItm._id).then(exItem => {
              if (mergePropertiesFromObject(exItem, ['title', 'date', 'enclosure'], newItm)) {
                return pouch.put(exItem);
              }
            });
          });
        }));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  });
}
