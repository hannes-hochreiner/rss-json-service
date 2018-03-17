import {default as axios} from 'axios';

export function httpForward(url, method, stream) {
  return _request(url, method, stream);
}

export function httpRequest(url) {
  return _request(url);
}

function _request(url, method, stream) {
  let opts = {
    url: url,
    headers: {'User-Agent': 'rss-json-service'}
  };

  if (method) {
    opts.method = method;
  }

  if (stream) {
    opts.responseType = 'stream';
  }

  let ret = axios(opts);

  if (stream) {
    ret = ret.then(resp => {
      stream.append('content-length', resp.headers['content-length']);
      resp.data.pipe(stream);
    });
  } else {
    ret = ret.then(resp => {
      return resp.data;
    });
  }

  return ret;
}
