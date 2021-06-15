use tokio_postgres::Client as DbClient;
use uuid::Uuid;
use crate::rss_feed::RssFeed;
use anyhow::Result;
use hyper::{body::HttpBody as _, Client as HttpClient, Uri};
use hyper_tls::HttpsConnector;

pub struct Repo {

}

impl Repo {
    pub async fn get_feeds(client: &DbClient) -> Result<Vec<RssFeed>> {
        let res = client
        .query(
            "SELECT id, url FROM feeds", &[]
        )
        .await?;

        let https = HttpsConnector::new();
        let client = HttpClient::builder()
            .build::<_, hyper::Body>(https);

        for row in res {
            let id: Uuid = row.try_get("id")?;
            let url: String = row.try_get::<&str, &str>("url")?.into();
            println!("id: {}, url: {}", id, url);

            // TODO: determine whether the url is http or https and choose the client accordingly
            // let client = HttpClient::new();
            let res = client.get(url.parse()?).await?;
            println!("status: {}", res.status());

            // Concatenate the body stream into a single buffer...
            let buf = hyper::body::to_bytes(res).await?;
            println!("body: {:?}", buf);
        }

        todo!()
    }
}
