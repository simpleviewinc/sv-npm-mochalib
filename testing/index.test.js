const assert = require("assert");
const child_process = require("child_process");
const mochaLib = require("../index.js");

describe(__filename, function() {
	describe("success", function() {
		var tests = [
			{
				name : "simple sync defer",
				defer : () => ({
					arg: "foo"
				})
			},
			{
				name : "async defer",
				defer : async () => ({
					arg : "foo"
				})
			},
			{
				name : "promise defer off event loop",
				defer : () => {
					var p = new Promise((resolve) => {
						setImmediate(function() {
							resolve({ arg : "foo" });
						});
					})
					
					return p;
				}
			},
			{
				name : "with before statement",
				before : (test) => {
					test.arg = "foo";
				},
				defer : () => ({
					
				})
			},
			{
				name : "with before async statement",
				before : async (test) => {
					test.arg = "foo";
				},
				defer : () => ({
					
				})
			},
			{
				name : "with after statement",
				defer : () => ({
					arg : "foo"
				}),
				after : (test) => {
					clearTimeout(test.p);
				}
			},
			{
				name : "with timeout",
				timeout : 10000,
				defer : async () => {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ arg : "foo" });
						}, 3000);
					});
				}
			}
		]
		
		mochaLib.testArray(tests, async function(test) {
			assert.strictEqual(test.arg, "foo");
		});
	});
	
	it("should handle after statement", function(done) {
		child_process.exec(`${__dirname}/../node_modules/.bin/mocha ${__dirname}/after.test.js`, function(err) {
			return done();
		});
	});
});