#[macro_use]
extern crate rocket;
extern crate rss_json_service;
use hyper::{body::Bytes, body::HttpBody as _, Client as HttpClient, StatusCode};
use hyper_tls::HttpsConnector;
use rocket::{response::stream::ByteStream, serde::json::Json, State};
use rss_json_service::repo::{channel::Channel, item::Item, Repo};
use std::{env, str};
use uuid::Uuid;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/channels")]
async fn channels(repo: &State<Repo>) -> Json<Vec<Channel>> {
    let channels = repo.get_all_channels().await.unwrap();

    Json(channels)
}

#[get("/channels/<channel_id>/items")]
async fn channel_items(repo: &State<Repo>, channel_id: &str) -> Json<Vec<Item>> {
    let channel_id = Uuid::parse_str(channel_id).unwrap();

    Json(repo.get_items_by_channel_id(&channel_id).await.unwrap())
}

#[get("/items/<item_id>/stream")]
async fn item_stream(repo: &State<Repo>, item_id: &str) -> ByteStream![Bytes] {
    let item_id = Uuid::parse_str(item_id).unwrap();
    let item = repo.get_item_by_id(&item_id).await.unwrap();
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
async fn rocket() -> _ {
    let repo = Repo::new(&*format!(
        "postgresql://{}:{}@localhost:5432/rss_json",
        env::var("RSS_JSON_USER").unwrap(),
        env::var("RSS_JSON_PASSWORD").unwrap(),
    ))
    .await
    .unwrap();

    rocket::build()
        .manage(repo)
        .mount("/", routes![index, channels, channel_items, item_stream])
}
