CREATE TABLE feeds (
  id uuid PRIMARY KEY,
  url varchar(1024) UNIQUE NOT NULL
);

CREATE TABLE channel (
  id uuid PRIMARY KEY,
  title varchar(512) UNIQUE NOT NULL,
  description varchar(2048) NOT NULL,
  image varchar(1024),
  feed_id uuid REFERENCES feeds (id)
);

CREATE TABLE item (
  id uuid PRIMARY KEY,
  title varchar(512) NOT NULL,
  date timestamp with time zone NOT NULL,
  enclosure_type varchar(128) NOT NULL,
  enclosure_url varchar(1024) NOT NULL,
  channel_id uuid REFERENCES channel (id)
);


CREATE ROLE updater LOGIN PASSWORD '{{updater_password}}';

GRANT SELECT, INSERT, UPDATE ON feeds TO updater;
GRANT SELECT, INSERT, UPDATE ON channel TO updater;
GRANT SELECT, INSERT, UPDATE ON item TO updater;
