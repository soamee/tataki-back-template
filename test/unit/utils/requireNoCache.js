/* eslint-disable */
const invalidateRequireCacheForFile = (filePath) => {
  delete require.cache[require.resolve(filePath)];
};

module.exports = (filePath) => {
  invalidateRequireCacheForFile(filePath);
  return require(filePath);
};
/* eslint-enable */
