const path = require('path');

module.exports = {
    entry: ['./src/www/engine/client.ts'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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
        path: path.resolve(__dirname, '../../../dist/web/engine'),
    }
};