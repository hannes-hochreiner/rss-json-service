export function deleteInternalKeys(obj) {
  Object.keys(obj).filter(key => {
    return key[0] === '_';
  }).forEach(key => {
    delete obj[key];
  });

  return obj;
}
