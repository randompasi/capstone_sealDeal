const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");
const babelrc = require("./.babelrc");

const relative = (/** @type {string} */ dir) => path.resolve(__dirname, dir);

const isDevelopment = process.env.NODE_ENV !== "production";
const publicPath = "/dist/";
const mode = isDevelopment ? "development" : "production";
const tailwindConfig = "./tailwind.config.js";

module.exports = {
	mode,
	entry: "./src/index.js",
	target: "web",
	output: {
		path: relative("dist"),
		filename: "[name].js",
		publicPath,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: relative("src/index.html"),
			filename: "index.html",
		}),
		isDevelopment && new ReactRefreshWebpackPlugin(),
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
										config: tailwindConfig,
									},
									autoprefixer: {},
								},
							},
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp)$/i,
				loader: "file-loader",
			},
		],
	},
	devServer: {
		open: true,
		hot: isDevelopment,
		static: {
			directory: relative("dist"),
			serveIndex: true,
			staticOptions: {},
			publicPath,
		},
		historyApiFallback: {
			index: "/dist/index.html",
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
			config: [__filename, ".babelrc.js", tailwindConfig, "package-lock.json"].map((_) =>
				relative(_)
			),
		},
		cacheDirectory: relative(".webpack-cache"),
		compression: "brotli",
	},
};
