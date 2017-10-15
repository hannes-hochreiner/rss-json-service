import {default as crypto} from 'crypto';

export function sha256hash(data) {
  let hash = crypto.createHash('sha256');

  hash.update(data);

  return hash.digest('hex');
}
