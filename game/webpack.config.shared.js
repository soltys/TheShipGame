var path = require('path');

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
            "game-core": path.join(__dirname, 'node_modules/game-core/src/index.ts'),
            "game-base": path.join(__dirname, 'node_modules/game-base/src/index.ts')
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
