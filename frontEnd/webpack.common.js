const path = require("path");
const webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname),
    entry: {
       bundle : "./src/index.js"
    },
    //resolve uses "*" to check for imported modules which have an extension present
    resolve: { extensions: ["*", ".js", ".jsx"] },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },      
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: {
                  loader: 'url-loader',
                },
            }

        ]
    },
    plugins : [new HtmlWebpackPlugin({
        template : "./public/template.html"
    })]
};