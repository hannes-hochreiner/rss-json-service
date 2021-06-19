#[macro_use]
extern crate rocket;
extern crate rss_json_service;
use hyper::{body::Bytes, body::HttpBody as _, Client as HttpClient, StatusCode};
use hyper_tls::HttpsConnector;
use rocket::{response::stream::ByteStream, serde::json::Json};
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

#[get("/items/<item_id>/stream")]
async fn item_stream(item_id: &str) -> ByteStream![Bytes] {
    let item_id = Uuid::parse_str(item_id).unwrap();

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

    let item = Repo::get_item_by_id(&db_client, &item_id).await.unwrap();
    let https = HttpsConnector::new();
    let http_client = HttpClient::builder().build::<_, hyper::Body>(https);
    let mut res = http_client
        .get(item.enclosure_url.parse().unwrap())
        .await
        .unwrap();

    match res.status() {
        StatusCode::FOUND
        | StatusCode::MOVED_PERMANENTLY
        | StatusCode::TEMPORARY_REDIRECT
        | StatusCode::PERMANENT_REDIRECT => {
            res = http_client
                .get(res.headers()["location"].to_str().unwrap().parse().unwrap())
                .await
                .unwrap();
        }
        StatusCode::OK => {}
        _ => {}
    }

    ByteStream! {
        while let Some(next) = res.data().await {
            let chunk = next.unwrap();
            yield chunk;
        }
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, channels, channel_items, item_stream])
}
