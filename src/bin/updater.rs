extern crate rss_json_service;
use anyhow::Result;
use hyper::Client as HttpClient;
use hyper_tls::HttpsConnector;
use rss_feed::RssFeed;
use rss_json_service::repo::Repo;
use rss_json_service::rss_feed;
use std::convert::TryFrom;
use std::{env, str};

#[tokio::main]
async fn main() -> Result<()> {
    let repo = Repo::new(&*format!(
        "postgresql://updater:{}@localhost:5432/rss_json",
        env::var("UPDATER_PASSWORD")?
    ))
    .await?;
    let https = HttpsConnector::new();
    let http_client = HttpClient::builder().build::<_, hyper::Body>(https);
    let feeds = repo.get_feeds().await?;

    for db_feed in feeds {
        // TODO: determine whether the url is http or https and choose the client accordingly
        // let client = HttpClient::new();
        let res = http_client.get(db_feed.url.parse()?).await?;
        // TODO: If the feed moved permanently, update the feed url
        println!("status: {}", res.status());

        // Concatenate the body stream into a single buffer...
        let buf = hyper::body::to_bytes(res).await?;
        let rss_feed = RssFeed::try_from(str::from_utf8(&buf)?)?;

        for rss_channel in &rss_feed.channels {
            let db_channel;

            match repo
                .get_channel_by_title_feed_id(&*rss_channel.title, &db_feed.id)
                .await?
            {
                Some(c) => db_channel = repo.update_channel(&c).await?,
                None => {
                    db_channel = repo
                        .create_channel(
                            &*rss_channel.title,
                            &*rss_channel.description,
                            &rss_channel.image,
                            &db_feed.id,
                        )
                        .await?
                }
            }

            for rss_item in &rss_channel.items {
                match repo
                    .get_item_by_title_date_channel_id(
                        &*rss_item.title,
                        &rss_item.date,
                        &db_channel.id,
                    )
                    .await?
                {
                    Some(i) => {
                        repo.update_item(&i).await?;
                    }
                    None => {
                        repo.create_item(
                            &*rss_item.title,
                            &rss_item.date,
                            &*rss_item.enclosure.mime_type,
                            &*rss_item.enclosure.url,
                            &db_channel.id,
                        )
                        .await?;
                    }
                }
            }
        }
        println!("{:?}", rss_feed);
    }

    Ok(())
}