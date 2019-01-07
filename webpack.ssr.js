const path = require("path");
const merge = require("webpack-merge");

const parts = require("./webpack.parts");

const PATHS = {
    build: path.join(__dirname, "../ssr"),
    ssrDemo: path.join(__dirname, "../es6", "ssr.js"),
};

module.exports = merge([
    {
        mode: "production",
        entry: {
            index: PATHS.ssrDemo,
        },
        output: {
            path: PATHS.build,
            filename: "[name].js",
            libraryTarget: "umd",
            globalObject: "this",
        },
    },
    parts.loadJavaScript({ include: PATHS.ssrDemo }),
]);