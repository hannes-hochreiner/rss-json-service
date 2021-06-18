#[macro_use]
extern crate rocket;
extern crate rss_json_service;
use rocket::serde::json::Json;
use rss_json_service::repo::{Channel, Item, Repo};
use std::{env, str};
use tokio_postgres::NoTls;
use uuid::Uuid;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/channels")]
async fn channels() -> Json<Vec<Channel>> {
    // Connect to the database.
    let (db_client, connection) = tokio_postgres::connect(
        &*format!(
            "postgresql://{}:{}@localhost:5432/rss_json",
            env::var("RSS_JSON_USER").unwrap(),
            env::var("RSS_JSON_PASSWORD").unwrap(),
        ),
        NoTls,
    )
    .await
    .unwrap();

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let channels = Repo::get_all_channels(&db_client).await.unwrap();

    Json(channels)
}

#[get("/channels/<channel_id>/items")]
async fn channel_items(channel_id: &str) -> Json<Vec<Item>> {
    let channel_id = Uuid::parse_str(channel_id).unwrap();

    // Connect to the database.
    let (db_client, connection) = tokio_postgres::connect(
        &*format!(
            "postgresql://{}:{}@localhost:5432/rss_json",
            env::var("RSS_JSON_USER").unwrap(),
            env::var("RSS_JSON_PASSWORD").unwrap(),
        ),
        NoTls,
    )
    .await
    .unwrap();

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    Json(
        Repo::get_items_by_channel_id(&db_client, &channel_id)
            .await
            .unwrap(),
    )
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, channels, channel_items])
}
