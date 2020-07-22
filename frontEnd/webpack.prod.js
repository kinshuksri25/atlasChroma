const path = require("path");
const webpack = require("webpack");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common,{
    mode: "production",
    //public path is not required since we are serving the bundle from same folder and same level
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "[name].[hash].js",
        publicPath: '/'
    },
    plugins : [new CleanWebpackPlugin()]
});