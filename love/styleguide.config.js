
const path = require('path')

module.exports = { 
    webpackConfig: require( './config/webpack.config.dev.js' ),
    require: [
      path.join(__dirname, 'src/index.css')
    ]
}
