import {default as xml2js} from 'xml2js';

export function parseXml(xmlString) {
  return new Promise((resolve, reject) => {
    (new xml2js.Parser()).parseString(xmlString, function (error, result) {
      if (error) {
        reject(error);

        return;
      }

      resolve(result);
    });
  });
}
