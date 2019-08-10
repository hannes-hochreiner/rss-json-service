export function parseRssJsObject(obj) {
  let res = {};

  res['title'] = obj.rss.channel[0].title[0];
  res['description'] = obj.rss.channel[0].description[0];

  let items = obj.rss.channel[0].item || [];

  res['items'] = items.map(itm => {
    let newItm = {};
    let guidTag = itm.guid || itm.link;
    let guid = (guidTag[0]._ || guidTag[0]).trim();

    if (!guid || typeof guid !== 'string' || guid.length == 0) {
      throw new Error('Could not find GUID of item.');
    }

    let pubDate = '1970-01-01T00:00:00.000Z';

    if (itm.pubDate && itm.pubDate[0]) {
      pubDate = itm.pubDate[0];
    }

    newItm['guid'] = guid;
    newItm['date'] = (new Date(pubDate)).toISOString();
    newItm['title'] = itm.title[0];
    
    if (typeof itm['itunes:subtitle'] !== 'undefined') {
      newItm['subtitle'] = itm['itunes:subtitle'][0].trim() || '';
    }

    if (itm.enclosure) {
      newItm['enclosure'] = {};
      newItm['enclosure']['url'] = itm.enclosure[0].$.url;
      newItm['enclosure']['type'] = itm.enclosure[0].$.type;
    }

    return newItm;
  });

  return res;
}
