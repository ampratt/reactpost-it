var webpack = require("webpack");

module.exports = {
	context: __dirname,
	entry: "./src/index.js",
	output: {
		path: __dirname + "/dist/assets",
		filename: "bundle.js",
		publicPath: "assets"
	},
	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000
	},
 module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          use: [
            {
            loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  'es2015',
                  'stage-0',
                  'react'
                ],
                plugins: [
                  'transform-decorators-legacy', 
                  'transform-class-properties'
                ],
              }
            }]
        },
        // {
        //   test: /\.json$/,    
        //   exclude: /(node_modules)/,
        //   use: [
        //     {
        //       loader: 'json-loader'
        //     }
        //   ]
        // },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        },
        {  
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            }, {
              loader: "sass-loader" // compiles Sass to CSS
            }
            
          ]
        }
      ]
  }

}







