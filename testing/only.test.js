const assert = require("assert");
const mochaLib = require("../index.js");

describe(__filename, function() {
	var tests = [
		{
			name : "failure",
			args : () => {
				throw new Error("failure!");
			}
		},
		{
			name : "after",
			only : true,
			args : {
				foo : "fooValue"
			}
		}
	]
	
	mochaLib.testArray(tests, function(test) {
		assert.strictEqual(test.foo, "fooValue");
	});
});