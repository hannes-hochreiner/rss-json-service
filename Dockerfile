FROM alpine:3.6
MAINTAINER Hannes Hochreiner <hannes@hochreiner.net>
RUN apk add --no-cache nodejs nodejs-npm
RUN mkdir -p /opt/rss-json-service
COPY src /opt/rss-json-service/src
COPY package.json /opt/rss-json-service/package.json
RUN cd /opt/rss-json-service && npm install && npm run build
EXPOSE 8888
CMD ["node", "/opt/rss-json-service/bld/main"]
