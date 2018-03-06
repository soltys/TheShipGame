//@ts-check

/**
 * @returns number
*/
function typescriptRule() {

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

module.exports.typescriptRule = typescriptRule;