FROM node:10.16.2-alpine
MAINTAINER Hannes Hochreiner <hannes@hochreiner.net>
RUN apk add make gcc g++ python2
RUN mkdir -p /opt/rss-json-service
COPY src /opt/rss-json-service/src
COPY package*.json /opt/rss-json-service/
RUN cd /opt/rss-json-service && npm install && npm run build
RUN apk del make gcc g++ python2
EXPOSE 8888
CMD ["node", "/opt/rss-json-service/bld/main"]
