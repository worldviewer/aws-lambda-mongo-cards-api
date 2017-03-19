var nodeExternals = require('webpack-node-externals');
var path = require('path');

// process.env.NODE_ENV = 'production';

module.exports = {
	entry: './cards.js',
	target: 'node',
	// because 'aws-sdk' is not compatible with webpack,
	// we exclude all node dependencies
	externals: [nodeExternals()],
	module: {
		loaders: [
    		{
        		test: /\.js$/,
        		loaders: [ 'babel-loader' ],
        		include: __dirname,
        		exclude: /node_modules/,
    		}
    	]
	}
}
