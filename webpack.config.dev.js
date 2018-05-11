const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpackBaseConfig = require('./webpack.config');
const openBrowserPlugin = require('open-browser-webpack-plugin');

const PORT = 8099;

webpackBaseConfig.entry = {
    test: [path.join(__dirname, 'example/index.js')]
};
webpackBaseConfig.output = {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/js/[name].[hash:8].js'
};

webpackBaseConfig.plugins = webpackBaseConfig.plugins.concat([
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
    new HtmlWebpackPlugin({
       filename: 'index.html',
       template: path.join(__dirname, 'example/index.html'),
       inject: 'body',
       minify: {
           removeComments: true,
           collapseWhitespace: true
       }
   }),
   new openBrowserPlugin({
       url: 'http://localhost:' + PORT
   })
]);

webpackBaseConfig.devServer = {
    contentBase: path.resolve(__dirname, 'src'),
    hot: true,
    inline: false,
    progress: true,
    stats: {
        color: true
    },
    port: process.env.PORT || PORT,
    historyApiFallback: true
};

module.exports = webpackBaseConfig;
