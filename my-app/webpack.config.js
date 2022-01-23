const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");
const babelrc = require("./.babelrc");

const relative = (/** @type {string} */ dir) => path.resolve(__dirname, dir);

const isDevelopment = process.env.NODE_ENV !== "production";
const publicPath = "/";
const mode = isDevelopment ? "development" : "production";
const tailwindConfigFile = "./tailwind.config.js";
const tailwindConfig = require(tailwindConfigFile);

console.log(`Building for ${mode}`);

module.exports = {
	mode,
	entry: "./src/index.js",
	target: "web",
	devtool: isDevelopment ? "eval-source-map" : "source-map",
	output: {
		path: relative("build"),
		filename: "[name].js",
		publicPath,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: relative("src/index.html"),
			filename: "index.html",
		}),
		isDevelopment && new ReactRefreshWebpackPlugin(),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(isDevelopment ? "development" : "production"),
			API_BASE_URL: JSON.stringify(isDevelopment ? "http://localhost:3000" : "/api"),
		}),
	].filter(Boolean),
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /[\\/]node_modules[\\/]/,
				loader: "babel-loader",
				options: {
					...babelrc,
					plugins: [
						...(babelrc.plugins || []),
						isDevelopment && require.resolve("react-refresh/babel"),
					].filter(Boolean),
				},
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: {
									tailwindcss: {
										config: {
											...tailwindConfig,
											purge: {
												...tailwindConfig.purge,
												enabled: !isDevelopment,
												content: ["src/**/*.js"],
											},
										},
									},
									autoprefixer: {},
								},
							},
						},
					},
				],
			},
			{
				test: /\.(jpe?g|webp|avif|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
				type: "asset/resource",
			},
		],
	},
	devServer: {
		open: true,
		hot: isDevelopment,
		port: 8000,
		static: {
			directory: relative("build"),
			serveIndex: true,
			staticOptions: {},
			publicPath,
		},
		historyApiFallback: {
			index: path.join(publicPath, "index.html"),
		},
		devMiddleware: {
			publicPath,
		},
	},
	resolve: {
		extensions: [".js", ".json", ".jsx", ".css"],
	},
	cache: {
		type: "filesystem",
		name: `capstone-sealdeal_${mode}`,
		version: "1",
		buildDependencies: {
			config: [__filename, ".babelrc.js", tailwindConfigFile, "package-lock.json"].map((_) =>
				relative(_)
			),
		},
		cacheDirectory: relative(".webpack-cache"),
		compression: "brotli",
	},
};
