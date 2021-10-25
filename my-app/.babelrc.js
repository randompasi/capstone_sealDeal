module.exports = {
	presets: [
		['@babel/preset-env', {
			targets: [
				'safari >= 12',
				'edge >= 79'
			],
			modules: false,
			useBuiltIns: 'entry',
			corejs: '3.19',
		}],
		['@babel/preset-react', {runtime: 'automatic'}]
	]
}