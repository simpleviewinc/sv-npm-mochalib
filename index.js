// umd boilerplate for CommonJS and AMD
if (typeof exports === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var validator = require("jsvalidator");

	// makes consistent the process of executing testArrays, allow possibility of easily adding before/after arrays at a later date
	var testArray = function(tests, fn) {
		tests.forEach(function(val, i) {
			validator.validate(val, {
				type : "object",
				schema : [
					{ name : "name", type : "string", required : true },
					{ name : "timeout", type : "number" },
					{ name : "before", type : "function" },
					{ name : "after", type : "function" },
					{ name : "only", type : "boolean", default : false },
					{ name : "skip", type : "boolean", default : false },
					{ name : "defer", type : "function", required : true }
				],
				throwOnInvalid : true
			});
			
			(val.skip ? it.skip : val.only ? it.only : it)(val.name, async function() {
				if (val.timeout !== undefined) {
					this.timeout(val.timeout);
				}
				
				var test = await val.defer();
				
				if (val.before !== undefined) {
					await val.before(test);
				}
				
				await fn(test);
				
				if (val.after !== undefined) {
					await val.after(test);
				}
			});
		});
	}

	module.exports = {
		testArray : testArray
	}
});