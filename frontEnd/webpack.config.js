const path = require("path");
const webpack = require("webpack");
const fs = require('fs');

module.exports = {
    entry: "./src/index.js",
    context: path.resolve(__dirname),
    mode: "development",
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: [/bower_components/, /node_modules/, /backend/],
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.resolve(__dirname, "src/dist/"),
        publicPath: "/src/dist/",
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "src/public/"),
        port: 3000,
        https: {
            key: fs.readFileSync('../lib/Certificates/serverKey.key'),
            cert: fs.readFileSync('../lib/Certificates/serverCert.crt')
        },
        publicPath: "/dist/",
        hotOnly: true,
        historyApiFallback: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};