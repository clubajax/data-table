const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const DEV = false;

module.exports = (
    {
        mode: 'production',
        entry: './build-profiles/all.js',
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'index.js',
            libraryTarget: 'umd',
            globalObject: 'this',
            // libraryExport: 'default',
            library: 'data-table'
        },
        // externals: {
        //     'lodash': {
        //         commonjs: 'lodash',
        //         commonjs2: 'lodash',
        //         amd: 'lodash',
        //         root: '_'
        //     },
        // },
        externals: [
            // '@clubajax/custom-elements-polyfill',
            '@clubajax/dom',
            '@clubajax/on',
            '@clubajax/base-component',
            // '@clubajax/dates',
            // '@clubajax/key-nav',
            // '@clubajax/no-dash'
        ],
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules)/,
                    use: 'babel-loader'
                },
                {
                    test: /\.scss$/i,
                    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                    use: [
                        DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                // indentWidth: 4,
                                // outputStyle: 'compressed',
                                webpackImporter: false,
                                sourceMap: true,
                            },
                        },
                    ],
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // all options are optional
                filename: 'data-table.css',
                // chunkFilename: '[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            })
        ]
    }
);
