export function byteToString(size) {
  if (size < 1000) {
    return `${size} bytes`;
  } else if (size < 1000000) {
    return `${(size / 1000).toFixed(2)} KB`;
  } else if (size < 1000000000) {
    return `${(size / 1000000).toFixed(2)} MB`;
  } else {
    return `${(size / 1000000000).toFixed(2)} GB`;
  }
}
