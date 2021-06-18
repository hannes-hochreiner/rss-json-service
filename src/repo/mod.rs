use anyhow::Result;
use chrono::{DateTime, FixedOffset};
use serde::Serialize;
use std::{convert::TryFrom, str};
use tokio_postgres::{Client, Row};
use uuid::Uuid;

pub struct Feed {
    pub id: Uuid,
    pub url: String,
}

impl TryFrom<&Row> for Feed {
    type Error = anyhow::Error;

    fn try_from(row: &Row) -> Result<Self, Self::Error> {
        Ok(Feed {
            id: row.try_get("id")?,
            url: row.try_get("url")?,
        })
    }
}

#[derive(Debug, Serialize)]
pub struct Channel {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub image: String,
    pub feed_id: Uuid,
}

impl TryFrom<&Row> for Channel {
    type Error = anyhow::Error;

    fn try_from(row: &Row) -> Result<Self, Self::Error> {
        Ok(Channel {
            id: row.try_get("id")?,
            description: row.try_get("description")?,
            title: row.try_get("title")?,
            image: row.try_get("image")?,
            feed_id: row.try_get("feed_id")?,
        })
    }
}

#[derive(Debug, Serialize)]
pub struct Item {
    pub id: Uuid,
    pub title: String,
    pub date: DateTime<FixedOffset>,
    pub enclosure_type: String,
    pub enclosure_url: String,
    pub channel_id: Uuid,
}

impl TryFrom<&Row> for Item {
    type Error = anyhow::Error;

    fn try_from(row: &Row) -> Result<Self, Self::Error> {
        Ok(Item {
            id: row.try_get("id")?,
            title: row.try_get("title")?,
            date: row.try_get("date")?,
            enclosure_type: row.try_get("enclosure_type")?,
            enclosure_url: row.try_get("enclosure_url")?,
            channel_id: row.try_get("channel_id")?,
        })
    }
}

pub struct Repo {}

impl Repo {
    pub async fn get_feeds(client: &Client) -> Result<Vec<Feed>> {
        let rows = client.query("SELECT id, url FROM feeds", &[]).await?;
        let mut res = Vec::<Feed>::new();

        for row in rows {
            res.push(Feed::try_from(&row)?);
        }

        Ok(res)
    }

    pub async fn get_channel_by_title_feed_id(
        client: &Client,
        title: &str,
        feed_id: &Uuid,
    ) -> Result<Option<Channel>> {
        let rows = client.query("SELECT id, title, description, image, feed_id FROM channels WHERE title=$1 AND feed_id=$2", &[&title, feed_id]).await?;

        match rows.len() {
            0 => Ok(None),
            1 => Ok(Some(Channel::try_from(&rows[0])?)),
            _ => Err(anyhow::Error::msg("more than one row found")),
        }
    }

    pub async fn get_all_channels(client: &Client) -> Result<Vec<Channel>> {
        let rows = client.query("SELECT * FROM channels", &[]).await?;
        let mut res = Vec::<Channel>::new();

        for row in rows {
            res.push(Channel::try_from(&row)?)
        }

        Ok(res)
    }

    pub async fn create_channel(
        client: &Client,
        title: &str,
        description: &str,
        image: &Option<String>,
        feed_id: &Uuid,
    ) -> Result<Channel> {
        let rows = client.query("INSERT INTO channels (id, title, description, image, feed_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", &[&Uuid::new_v4(), &title, &description, &image, feed_id]).await?;

        match rows.len() {
            1 => Ok(Channel::try_from(&rows[0])?),
            _ => Err(anyhow::Error::msg("error creating channel")),
        }
    }

    pub async fn update_channel(client: &Client, channel: &Channel) -> Result<Channel> {
        let rows = client.query("UPDATE channels SET title=$1, description=$2, image=$3, feed_id=$4 WHERE id=$5 RETURNING *", &[&channel.title, &channel.description, &channel.image, &channel.feed_id, &channel.id]).await?;

        match rows.len() {
            1 => Ok(Channel::try_from(&rows[0])?),
            _ => Err(anyhow::Error::msg("error updating channel")),
        }
    }

    pub async fn get_items_by_channel_id(client: &Client, channel_id: &Uuid) -> Result<Vec<Item>> {
        let rows = client
            .query("SELECT * FROM items WHERE channel_id = $1", &[channel_id])
            .await?;
        let mut res = Vec::<Item>::new();

        for row in rows {
            res.push(Item::try_from(&row)?)
        }

        Ok(res)
    }

    pub async fn get_item_by_title_date_channel_id(
        client: &Client,
        title: &str,
        date: &DateTime<FixedOffset>,
        channel_id: &Uuid,
    ) -> Result<Option<Item>> {
        let rows = client
            .query(
                "SELECT * FROM items WHERE title=$1 AND date=$2 AND channel_id=$3",
                &[&title, date, channel_id],
            )
            .await?;

        match rows.len() {
            0 => Ok(None),
            1 => Ok(Some(Item::try_from(&rows[0])?)),
            _ => Err(anyhow::Error::msg("more than one row found")),
        }
    }

    pub async fn create_item(
        client: &Client,
        title: &str,
        date: &DateTime<FixedOffset>,
        enclosure_type: &str,
        enclosure_url: &str,
        channel_id: &Uuid,
    ) -> Result<Item> {
        let rows = client.query("INSERT INTO items (id, title, date, enclosure_type, enclosure_url, channel_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", &[&Uuid::new_v4(), &title, date, &enclosure_type, &enclosure_url, channel_id]).await?;

        match rows.len() {
            1 => Ok(Item::try_from(&rows[0])?),
            _ => Err(anyhow::Error::msg("error creating channel")),
        }
    }

    pub async fn update_item(client: &Client, item: &Item) -> Result<Item> {
        let rows = client.query("UPDATE items SET title=$1, date=$2, enclosure_type=$3, enclosure_url=$4, channel_id=$5 WHERE id=$6 RETURNING *", &[&item.title, &item.date, &item.enclosure_type, &item.enclosure_url, &item.channel_id, &item.id]).await?;

        match rows.len() {
            1 => Ok(Item::try_from(&rows[0])?),
            _ => Err(anyhow::Error::msg("error updating channel")),
        }
    }
}
