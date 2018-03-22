// eslint-disable-next-line import/prefer-default-export
export function chunkArray(array, size) {
  return array.reduce((acc, val) => {
    if (acc.length === 0) acc.push([]);
    const last = acc[acc.length - 1];
    if (last.length < size) {
      last.push(val);
    } else {
      acc.push([val]);
    }
    return acc;
  }, []);
}

export function omit(source, ...omitItems) {
  return Object.keys(source).reduce((acc, key) =>
            Object.assign({}, acc, omitItems.includes(key) ? null : { [key]: source[key] })
        , {});
}
