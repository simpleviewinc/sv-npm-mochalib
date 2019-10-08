const assert = require("assert");
const mochaLib = require("../src/index.js");

describe(__filename, function() {
	var tests = [
		{
			name : "after",
			args : () => ({
				p : setTimeout(() => {
					
				}, 30000)
			}),
			after : (test) => {
				clearTimeout(test.p);
			}
		}
	]
	
	mochaLib.testArray(tests, function() {});
});