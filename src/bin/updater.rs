extern crate rss_json_service;
use anyhow::Result;
use hyper::Client as HttpClient;
use hyper_tls::HttpsConnector;
use rss_feed::RssFeed;
use rss_json_service::repo::Repo;
use rss_json_service::rss_feed;
use std::convert::TryFrom;
use std::{env, str};
use tokio_postgres::NoTls;

#[tokio::main]
async fn main() -> Result<()> {
    // Connect to the database.
    let (db_client, connection) = tokio_postgres::connect(
        &*format!(
            "postgresql://updater:{}@localhost:5432/rss_json",
            env::var("UPDATER_PASSWORD")?
        ),
        NoTls,
    )
    .await?;

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let https = HttpsConnector::new();
    let http_client = HttpClient::builder().build::<_, hyper::Body>(https);
    let feeds = Repo::get_feeds(&db_client).await?;

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

            match Repo::get_channel_by_title_feed_id(&db_client, &*rss_channel.title, &db_feed.id)
                .await?
            {
                Some(c) => db_channel = Repo::update_channel(&db_client, &c).await?,
                None => {
                    db_channel = Repo::create_channel(
                        &db_client,
                        &*rss_channel.title,
                        &*rss_channel.description,
                        &rss_channel.image,
                        &db_feed.id,
                    )
                    .await?
                }
            }

            for rss_item in &rss_channel.items {
                match Repo::get_item_by_title_date_channel_id(
                    &db_client,
                    &*rss_item.title,
                    &rss_item.date,
                    &db_channel.id,
                )
                .await?
                {
                    Some(i) => {
                        Repo::update_item(&db_client, &i).await?;
                    }
                    None => {
                        Repo::create_item(
                            &db_client,
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
