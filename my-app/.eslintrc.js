module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:jest/recommended",
		"plugin:prettier/recommended",
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["react", "jest"],
	rules: {
		"react/prop-types": "off",
		"eol-last": "warn",
		"no-var": "error",
		"prefer-const": "error",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	globals: {
		API_BASE_URL: "readonly",
	},
};
