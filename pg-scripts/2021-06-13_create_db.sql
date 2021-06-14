CREATE TABLE feeds (
  id uuid PRIMARY KEY,
  url varchar(512) UNIQUE NOT NULL
);

CREATE ROLE updater LOGIN PASSWORD '{{updater_password}}';

GRANT SELECT ON feeds TO updater;
GRANT INSERT ON feeds TO updater;
