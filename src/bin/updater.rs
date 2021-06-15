extern crate rss_json_service;
use rss_feed::RssFeed;
use rss_json_service::rss_feed;
use anyhow::Result;
use rss_json_service::repo::Repo;
use std::env;
use tokio_postgres::{NoTls};

#[tokio::main]
async fn main() -> Result<()> {
    // Connect to the database.
    let (client, connection) = tokio_postgres::connect(
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
    
    Repo::get_feeds(&client).await?;
    Ok(())
}
