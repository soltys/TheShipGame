var path = require('path');
var outputPath = path.resolve(__dirname, 'build');
var autoprefixer = require('autoprefixer');
var sassPath = path.resolve(__dirname, 'src/scss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StyleLintPlugin = require('stylelint-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:8080/',
            './src/ts/app.ts'
        ]
    },
    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: 'build/',
        devtoolLineToLine: true
    },
    resolve: {
        root: [path.join(__dirname, 'node_modules')],
        extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
    },
    devtool: 'source-map',
    module: {
        //     preLoaders: [{
        //  test: /\.ts$/,
        //            loader: 'tslint'
        //         }],
        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract(['css', 'postcss', 'sass'])
        }]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new StyleLintPlugin({
            configFile: '.stylelintrc',
            syntax: 'scss',
            files: ['**/*.s?(a|c)ss'],
            failOnError: false,
        }),
        new CopyWebpackPlugin([{ from: 'assets', to: 'build/assets' }]),

    ],
    tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'src/ts'
    },
    sassLoader: {
        includePaths: [
            sassPath,
            'node_modules/normalize-scss/sass'
        ]
    },
    postcss: [autoprefixer({
        browsers: ['> 1%']
    })]
}
