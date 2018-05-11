const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.join(__dirname, 'src')
        }
    },
    plugins: [
        new FriendlyErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [ path.join(__dirname, 'src'), path.join(__dirname, 'example')]
        }]
    },
    devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map'
}
