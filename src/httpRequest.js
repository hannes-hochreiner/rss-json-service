import { default as urlModule } from 'url';
import { default as http } from 'http';
import { default as https } from 'https';

export function httpForward(url, method, stream) {
  return _request(url, method, stream);
}

export function httpRequest(url) {
  return _request(url);
}

function _request(url, method, stream) {
  return new Promise((resolve, reject) => {
    let options = new urlModule.parse(url);
    let prot;

    if (options.protocol === 'http:') {
      prot = http;
    } else if (options.protocol === 'https:') {
      prot = https;
    } else {
      reject(new Error(`Unknown protocol ${options.protocol}`));
      return;
    }

    if (method) {
      options.method = method;
    }

    let req = prot.request(options, (res) => {
      const { statusCode } = res;
      let error;

      console.log(`request ${options.href} returned status code ${statusCode}`);

      if (statusCode !== 200) {
        if (statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308) {
          res.resume();
          resolve(_request(res.headers.location, method, stream));
        } else {
          // consume response data to free up memory
          res.resume();
          reject(new Error(`Request Failed.\nStatus Code: ${statusCode}`));
          return;
        }
      }

      let rawData = '';

      if (stream) {
        stream.append('content-length', res.headers['content-length']);
      } else {
        res.setEncoding('utf8');
      }

      res.on('data', (chunk) => {
        if (stream) {
          stream.write(chunk);
        } else {
          rawData += chunk;
        }
      });

      res.on('end', () => {
        if (stream) {
          stream.end();
        }

        resolve(rawData);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
