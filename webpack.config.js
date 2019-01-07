const merge = require('webpack-merge')
const parts = require('./webpack.parts')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const glob = require("glob")

const PATHS = {
    app: path.join(__dirname, "../es6"),
    build: path.join(__dirname, "../dist"),

};

const commonConfig = merge([
    {
        entry: './es6/main.js',
        output: {
            // filename: "bundle.js",
            chunkFilename: "[name].[chunkhash:4].js",
            filename: "[name].[chunkhash:4].js",
            path: path.resolve(__dirname, '../dist'),
            // publicPath: "/",
            publicPath: "/webpack-demo/",
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Webpack demo",
            }),
        ],
    },
    // parts.loadCSS()
]);

const productionConfig = merge([
    parts.extractCSS({
        use: ["css-loader", parts.autoprefix()],
    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, {nodir: true}),
    }),
    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
            },
            // Run cssnano in safe mode to avoid
            // potentially unsafe transformations.
            safe: true,
        },
    }),
    parts.loadImages({
        options: {
            limit: 15000,
            name: "[name].[hash:4].[ext]"
        },
    }),
    parts.clean(PATHS.build),
    parts.attachRevision(),
    parts.minifyJavaScript(),
    parts.loadJavaScript(),
    // parts.generateSourceMaps({type: "nosources-source-map"}),
    {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "initial",
                    },
                },
            },
            runtimeChunk: {
                name: "manifest",
            },
        },
    }

]);

const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.extractCSS({
        use: ["css-loader", parts.autoprefix()],
    }),
    parts.loadImages({
        options: {
            limit: 15000,
            name: "[name].[ext]",
        },
    }),

]);

module.exports = mode => {
    // return merge(commonConfig, productionConfig, {mode:"development"});
    // const pages = [
    //     parts.page({
    //         title: "Webpack demo",
    //         entry: {
    //             app: path.join(PATHS.app, "main.js"),
    //         },
    //         chunks: ["app", "manifest", "vendors~app"],
    //
    //     }),
    //     parts.page({
    //         title: "Another demo",
    //         path: "another",
    //         entry: {
    //             another: path.join(PATHS.app, "another.js"),
    //         },
    //         chunks: ["app", "manifest", "vendors~app"],
    //
    //     }),
    // ];
    //
    // const config =
    //     mode === "production" ? productionConfig : developmentConfig;
    // return merge([commonConfig, config, { mode }].concat(pages));

    // return pages.map(page =>
    //     merge(commonConfig, config, page, { mode })
    // );

    if (mode === "production") {
        return merge(commonConfig, productionConfig, {mode});
    }

    const dev = merge(commonConfig, developmentConfig, {mode})
    console.log(dev)
    return dev
};