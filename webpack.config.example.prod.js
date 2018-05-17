const path = require('path');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.config.dev');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const uglify = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


webpackDevConfig.plugins = webpackDevConfig.plugins.concat([
    new cleanWebpackPlugin(
        [
            'dist',
        ],　
        {
            root: __dirname,
            verbose: true,
            dry:false
        }
    ),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true
    }),
    new uglify({
        uglifyOptions: {
            output: {
                comments: false,
                beautify: false
            }
        }
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
]);

module.exports = webpackDevConfig;
