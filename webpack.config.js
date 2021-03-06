const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = env => {
	const ENV = env?.NODE_ENV || "development";

	return {
		context: path.resolve(__dirname, "src"),
		entry: "./index.tsx",

		output: {
			path: path.resolve(__dirname, "build"),
			publicPath: "/",
			filename: "bundle.js"
		},

		optimization: {
			minimize: ENV === "production"
		},

		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".scss"],
			modules: [
				path.resolve(__dirname, "src/lib"),
				path.resolve(__dirname, "node_modules"),
				"node_modules"
			],
			alias: {
				"@": path.resolve(__dirname, "src"),
				"react": "preact/compat",
				"react-dom": "preact/compat"
			}
		},

		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					loaders: ["ts-loader"]
				},
				{
					test: /\.(scss|css)$/,
					use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: ["css-loader", "sass-loader"]
					})
				},
				{
					test: /\.(xml|html|txt|md)$/,
					use: "raw-loader"
				},
				{
					test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif|mp3)(\?.*)?$/i,
					use: ENV ==="production" ? "file-loader" : "url-loader"
				}
			]
		},
		plugins: ([
			new webpack.NoEmitOnErrorsPlugin(),
			new ExtractTextPlugin({
				filename: "style.css",
				allChunks: true,
				disable: false
			}),
			new webpack.DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify(ENV)
			}),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, "public", "index.html"),
				minify: { collapseWhitespace: true },
				inject: false
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: path.join(__dirname, "public"), to: "./" }
				]
			})
		]),

		stats: { colors: true },

		node: {
			global: true,
			process: false,
			Buffer: false,
			__filename: false,
			__dirname: false,
			setImmediate: false
		}
	};
}
