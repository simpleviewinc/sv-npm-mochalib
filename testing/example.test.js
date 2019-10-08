const mochaLib = require("../src/index");
const assert = require("assert");

describe(__filename, function() {
	describe("test array", function() {
		const tests = [
			{
				name : "test 1",
				args : {
					num : 1,
					result : 2
				}
			},
			{
				name : "test 2",
				args : {
					num : 2,
					result : 4
				}
			}
		]
		
		mochaLib.testArray(tests, function(test) {
			assert.strictEqual(test.num * 2, test.result);
		});
	});
});