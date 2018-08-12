var path = require('path');
var outputPath = path.resolve(__dirname, 'build');
var autoprefixer = require('autoprefixer');
var sassPath = path.resolve(__dirname, 'src/scss');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var webpackConfigShared = require('./webpack.config.shared');

/**
 *
 * @param {object} env
 */
function getAppSettings(env) {
    const app = [];
    if (!env.production) {
        app.push('webpack-dev-server/client?http://localhost:9000/');
    }
    app.push('./src/app.tsx');
    return app;
}
/**
 * @returns {webpack.Configuration}
 * @param {object} env
 */
function getWebpackConfig(env) {
    return {
        devServer: {
            port: 9000
        },
        entry: {
            app: getAppSettings(env)
        },
        output: {
            path: outputPath,
            filename: '[name].js',
            publicPath: 'build/'
        },
        resolve: webpackConfigShared.resolve(),
        devtool: 'eval-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    enforce: "pre",
                    loader: 'tslint-loader'
                },
                // {
                //     test: /\.js$/,
                //     enforce: "pre",
                //     loader: 'source-map-loader'
                // },
                webpackConfigShared.typescriptRule(),
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                }
            ]
        },
        plugins: [
            // @ts-ignore
            new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }]),
            new webpack.LoaderOptionsPlugin({
                debug: true,
                options: {
                    postcss: [autoprefixer({
                        browsers: ['> 1%']
                    })],
                    sassLoader: {
                        includePaths: [
                            sassPath,
                            'node_modules/normalize-scss/sass'
                        ]
                    },
                    tslint: {
                        emitErrors: false,
                        failOnHint: false,
                        resourcePath: 'src'
                    }
                }
            })
        ],
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "pixi.js": "PIXI"
        },
    }
};

module.exports = function (env) {
    return getWebpackConfig(env);
};
