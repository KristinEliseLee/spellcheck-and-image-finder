// JavaScript source code
const Dotenv = require('dotenv-webpack');
module.exports = {
    devtool: 'source-map',
    entry: "./app.jsx",
    mode: "development",
    output: {
        filename: "./app-bundle.js"
    },
    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.js', '.jsx',]
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: {
                    loader: 'css-loader'
                }
                
      
            }
        ]
    },
    plugins: [
        new Dotenv()
    ]
};
