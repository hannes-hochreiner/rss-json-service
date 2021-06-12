![CI](https://github.com/hannes-hochreiner/rss-json-service/workflows/CI/badge.svg)
# rss-json-service
A simple RSS to JSON web service.

The service parses a list of RSS feeds periodically into objects with the following properties:

```rust
struct RssEnclosure {
  url: String,
  mime_type: String,
  length: i32,
}

struct RssItem {
  date: DateTime,
  title: String,
  enclosure: RssEnclosure,
}

struct RssChannel {
  title: String,
  description: String,
  image: String,
  items: Vec<RssItem>,
}

struct RssFeed {
  channels: Vec<RssChannel>
}
```
