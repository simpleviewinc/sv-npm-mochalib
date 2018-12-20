const assert = require("assert");
const mochaLib = require("../index.js");

describe(__filename, function() {
	var tests = [
		{
			name : "after",
			defer : () => ({
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