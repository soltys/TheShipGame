var path = require('path');
var webpackConfigShared = require('./webpack.config.shared');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            // all files ending in "_test"
            { pattern: 'test/*_test.ts' },
            { pattern: 'test/**/*_test.ts' }
            // each file acts as entry point for the webpack configuration
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // add webpack as preprocessor
            'test/*_test.ts': ['webpack'],
            'test/**/*_test.ts': ['webpack']
        },

        webpack: {
            resolve: webpackConfigShared.resolve(),
            devtool: 'source-map',
            module: {
                rules: [
                    webpackConfigShared.typescriptRule()
                ]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadless'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        plugins: ['karma-*'],
        client: {
            mocha: { ui: 'bdd' }
        },
        typescriptPreprocessor: {
            transformPath: function (path) {
                return path.replace(/\.ts$/, '.js');
            }
        }
    })
}
