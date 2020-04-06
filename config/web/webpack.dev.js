const Path = require("path");
const Webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.web.js");

module.exports = merge(common, {
    devtool: "inline-source-map",
    mode: "development",
    optimization: {
        minimize: false
    },
    devServer: {
        contentBase: Path.join(__dirname, "dist"),
        compress: false,
        historyApiFallback: true,
        hot: true,
        https: false,
        noInfo: false
    },
    plugins: [
        new Webpack.NamedModulesPlugin(),
        new Webpack.HotModuleReplacementPlugin()
    ]
});
