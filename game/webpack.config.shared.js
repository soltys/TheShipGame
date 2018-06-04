//@ts-check
var path = require('path');
var webpack = require('webpack');
/**
 * @returns {webpack.Resolve}
 */
module.exports.resolve = function () {
    return {
        modules: [
            path.join(__dirname, 'node_modules'),
        ],
        extensions: ['.ts', '.tsx', '.webpack.js', '.web.js', '.js'],
        alias: {
            "@core": path.join(__dirname, 'src/core'),
            "@base": path.join(__dirname, 'src/base'),
            "@IGame": path.join(__dirname, 'src/IGame.ts')
        }
    };
}

/**
 * @returns {webpack.Rule}
 */
module.exports.typescriptRule = function () {
    return {
        test: /\.tsx?$/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            { loader: 'ts-loader' },
        ],
        exclude: [/\.(spec|e2e|d)\.ts$/]
    };
}
