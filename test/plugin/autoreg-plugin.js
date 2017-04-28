const async = require('async');

module.exports = {
	setup: function(config, result, callback) {
		const returnObj = result;
		returnObj.autoRegPlugin = true;

		//array for waterfall methods
		const sampleCalls = [
			function(cbk) {
				setTimeout(() => {
					cbk(null, {
						fine: 'good'
					})
				}, 2000)
			}
		];

		sampleCalls.push((res, cbk) => {
			cbk(null, {
				result: 'good'
			});
		});

		async.waterfall(sampleCalls, (err) => {
			callback(err, config, returnObj);
		});
	}
};
