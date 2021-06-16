use anyhow::Result;
use std::env;
use tokio_postgres::NoTls;
use uuid::{self, Uuid};

#[tokio::main] // By default, tokio_postgres uses the tokio crate as its runtime.
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

    let uuid = Uuid::new_v4();
    let url = "https://rss.art19.com/the-take";
    // Now we can execute a simple statement that just returns its parameter.
    let _ = client
        .query(
            "INSERT INTO feeds (id, url) VALUES ($1, $2)",
            &[&uuid, &url],
        )
        .await?;

    Ok(())
}
