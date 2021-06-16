use anyhow::Result;
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
    ) -> Result<Channel> {
        let rows = client.query("SELECT id, title, description, image, feed_id FROM channels WHERE title=$1 AND feed_id=$2", &[&title, feed_id]).await?;

        Ok(Channel::try_from(&rows[0])?)
    }
}
