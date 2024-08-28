const path = require('path');
const { override, addWebpackAlias, addPostcssPlugins } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    '@/src': path.resolve(__dirname, 'src'),
  })
);
