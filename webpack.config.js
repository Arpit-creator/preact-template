const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = env => {
	const ENV = env.NODE_ENV || 'development';

	return {
		context: path.resolve(__dirname, "src"),
		entry: './index.js',

		output: {
			path: path.resolve(__dirname, "build"),
			publicPath: '/',
			filename: 'bundle.js'
		},

		optimization: {
			minimize: ENV === 'production'
		},

		resolve: {
			extensions: ['.jsx', '.js', '.json', '.scss'],
			modules: [
				path.resolve(__dirname, "src/lib"),
				path.resolve(__dirname, "node_modules"),
				'node_modules'
			],
			alias: {
				'@': path.resolve(__dirname, "src"),
				'react': 'preact/compat',
				'react-dom': 'preact/compat'
			}
		},

		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: path.resolve(__dirname, 'src'),
					enforce: 'pre',
					use: 'source-map-loader'
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				},
				{
					test: /\.(scss|css)$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: ['css-loader', 'sass-loader']
					})
				},
				{
					test: /\.json$/,
					use: 'json-loader'
				},
				{
					test: /\.(xml|html|txt|md)$/,
					use: 'raw-loader'
				},
				{
					test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif|mp3)(\?.*)?$/i,
					use: ENV ==='production' ? 'file-loader' : 'url-loader'
				}
			]
		},
		plugins: ([
			new webpack.NoEmitOnErrorsPlugin(),
			new ExtractTextPlugin({
				filename: 'style.css',
				allChunks: true,
				disable: false
			}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(ENV)
			}),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, 'public', 'index.html'),
				minify: { collapseWhitespace: true }
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: path.join(__dirname, 'public'), to: './' }
				]
			})
		].concat(ENV === 'production' ? [
			new SWPrecacheWebpackPlugin({
				cacheId: 'preact-template-v1',
				dontCacheBustUrlsMatching: /\.\w{8}\./,
				filename: 'service-worker.js',
				minify: true,
				navigateFallback: 'url to deployment url',
				staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
			})
		] : [])),

		stats: { colors: true },

		node: {
			global: true,
			process: false,
			Buffer: false,
			__filename: false,
			__dirname: false,
			setImmediate: false
		},

		devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

		devServer: {
			port: process.env.PORT || 8080,
			host: 'localhost',
			publicPath: '/',
			contentBase: './src',
			historyApiFallback: true,
			open: true,
			openPage: ''
		}
	};
}
