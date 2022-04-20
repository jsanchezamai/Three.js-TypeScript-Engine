const path = require('path');

module.exports = {
    entry: ['./src/web/engine/client.ts'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.worker.js$/i,
                exclude: /node_modules/,
                use: [
                  'worker-loader'
                ]
            }
        ],
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three')
        },
        extensions: ['.tsx', '.ts', '.js', '.d.ts']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../../dist/web/editor/engine'),
    }
};