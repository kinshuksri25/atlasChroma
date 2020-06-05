const path = require("path");
const webpack = require("webpack");
const fs = require('fs');
const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(common,{
    mode: "development",
    //public path is not required since we are serving the bundle from same folder and same level
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "[name].js"
    },
    //contentBase – This property tells Webpack what static file it should serve and from where. 
    //publicPath – Defines what the browser path will look like when serving public assets. https://localhost:3000/assets/...
    devServer: {
        //contentBase: path.join(__dirname, "dist/index.html"), this is commented due to dist folder not creating in dev mode
        port: 3000,
        https: {
            key: fs.readFileSync('../lib/Certificates/private.key'),
            cert: fs.readFileSync('../lib/Certificates/private.crt')
        },
        hotOnly: true,
        historyApiFallback: true
    },
     plugins : [new webpack.HotModuleReplacementPlugin()]
});