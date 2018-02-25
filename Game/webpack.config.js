var path = require('path');
var outputPath = path.resolve(__dirname, 'build');
var autoprefixer = require('autoprefixer');
var sassPath = path.resolve(__dirname, 'src/scss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');


function getAppSettings(env) {
    const app = [];
    if (!env.production) {
        app.push('webpack-dev-server/client?http://localhost:8080/');
    }
    app.push('./src/app.tsx');
    app.push('./../core/src/index.ts');
    app.push('./../base/src/index.ts');
    return app;
}

module.exports = function (env) {
    return {
        entry: {
            app: getAppSettings(env)
        },
        output: {
            path: outputPath,
            filename: '[name].js',
            publicPath: 'build/'
        },
        resolve: {
            modules: [
                path.join(__dirname, 'node_modules'),
            ],
            extensions: ['.ts', '.tsx', '.webpack.js', '.web.js', '.js']
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    enforce: "pre",
                    loader: 'tslint-loader'
                },
                {
                    test: /\.js$/,
                    enforce: "pre",
                    loader: 'source-map-loader'
                },
                {
                    test: /\.tsx?$/,
                    loader: ['babel-loader', 'awesome-typescript-loader'],
                    exclude: [/\.(spec|e2e|d)\.ts$/]
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader'])
                }]
        },
        plugins: [
            new ExtractTextPlugin('[name].css'),
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
}
