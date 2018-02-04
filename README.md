# rss-json-service
A simple RSS to JSON web service.

## Failing feeds
http://www.rtl.fr/podcast/le-grand-jury.xml

request http://www.podtrac.com/pts/redirect.mp3/feeds.soundcloud.com/stream/389140464-makingitpodcast-episode-153-thinking-hard-about-thinking-hard.mp3 returned status code 302
request http://feeds.soundcloud.com/stream/389140464-makingitpodcast-episode-153-thinking-hard-about-thinking-hard.mp3 returned status code 302
request http://cf-media.sndcdn.com/9umiNV9DVA8L?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vOXVtaU5WOURWQThMIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTE3MDY4MTA5fX19XX0_&Signature=nBBDmWcv58YA3M-mbNVq6Gdr3RMIETvrf-zpSWWzLsTVg57MeyDXEEZp~~pAy7EumsZcpW3LDkw2suir253Uw4zs2pIbULH1cVFIL-mlbxQYQgnSzdVfeMRS9ui2BT5JP1kF09o0Wo0mCjGLb7zw1684rtfCPUOtZxMRkiakIjnP06u4yNluZ~X~BSPozPuu5Q5FQVQcpaE9XdLD3-ItFf6WuQhVcExs1Xy9ygr8trzsbrJuOUt47ZyeK21236IWt9Pl~97cYgfw4FCQ8A5xp~6NXLaRVZ2cR0sf32MCrd4cPsp4wu2TmLxkvL3Djh8MRmSeMldLw4W2gkmNsNWZ-g__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ returned status code 200
request http://www.podtrac.com/pts/redirect.mp3/feeds.soundcloud.com/stream/389140464-makingitpodcast-episode-153-thinking-hard-about-thinking-hard.mp3 returned status code 302
request http://feeds.soundcloud.com/stream/389140464-makingitpodcast-episode-153-thinking-hard-about-thinking-hard.mp3 returned status code 302
_http_outgoing.js:494
    throw new Error('Can\'t set headers after they are sent.');
    ^

Error: Can't set headers after they are sent.
    at validateHeader (_http_outgoing.js:494:11)
    at ServerResponse.setHeader (_http_outgoing.js:501:3)
    at ServerResponse.header (/opt/rss-json-service/node_modules/express/lib/response.js:767:10)
    at ServerResponse.append (/opt/rss-json-service/node_modules/express/lib/response.js:728:15)
    at ClientRequest.<anonymous> (/opt/rss-json-service/bld/httpRequest.js:73:18)
    at Object.onceWrapper (events.js:315:30)
    at emitOne (events.js:116:13)
    at ClientRequest.emit (events.js:211:7)
    at HTTPParser.parserOnIncomingClient [as onIncoming] (_http_client.js:551:21)
    at HTTPParser.parserOnHeadersComplete (_http_common.js:117:23)
