![CI](https://github.com/hannes-hochreiner/rss-json-service/workflows/CI/badge.svg)
# rss-json-service
A simple RSS to JSON web service.

The service parses a list of RSS feeds periodically into objects with the following properties:

```rust
pub struct RssFeed {
    channels: Vec<RssChannel>,
}

pub struct RssChannel {
    title: String,
    description: String,
    image: Option<String>,
    items: Vec<RssItem>,
}

struct RssEnclosure {
    url: String,
    mime_type: String,
    length: i32,
}

struct RssItem {
    date: DateTime<FixedOffset>,
    title: String,
    enclosure: RssEnclosure,
}
```
## Development

### Setup

A local container was used as a development database.

```bash
podman run --name rss-json -e POSTGRES_DB=rss_json -e POSTGRES_PASSWORD=<password> -p 5432:5432 -d postgres:alpine
```

The database scripts were then executed using the local psql.

```bash
psql postgresql://postgres:<password>@localhost:5432/rss_json -f pg-scripts/2021-06-13_create_db.sql
```

An Ansible script automating this process can be found in the `ansible` folder.
The scripts expects a variable named `db_password`, which must be provided in a file names `vars.yml` in the Ansible folder.
If the password is encrypted with Ansible vault, the ansible script can be run with the following command:

```bash
ansible-playbook --ask-vault-pass ansible/db_create_pb.yml
```

### Test entries

A program names `test_inserter` is provided to create some entries in the feeds table.
The program can be run with the following command:

```bash
UPDATER_PASSWORD=<password> cargo run --bin test_inserter
```

## Deployment

### rss-json-service

The rss-json-service expects two environment variables providing the database credentials.

```bash
RSS_JSON_USER=<db_user> RSS_JSON_PASSWORD=<db_password> cargo run --bin rss-json-service
```
