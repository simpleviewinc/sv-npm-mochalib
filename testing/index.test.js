const assert = require("assert");
const child_process = require("child_process");
const mochaLib = require("../index.js");

describe(__filename, function() {
	describe("success", function() {
		var tests = [
			{
				name : "object",
				args : {
					arg : "foo"
				}
			},
			{
				name : "simple sync args",
				args : () => ({
					arg: "foo"
				})
			},
			{
				name : "async args",
				args : async () => ({
					arg : "foo"
				})
			},
			{
				name : "promise defer off event loop",
				args : () => {
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
				args : () => ({
					
				})
			},
			{
				name : "with before async statement",
				before : async (test) => {
					test.arg = "foo";
				},
				args : () => ({
					
				})
			},
			{
				name : "with after statement",
				args : () => ({
					arg : "foo"
				}),
				after : (test) => {
					clearTimeout(test.p);
				}
			},
			{
				name : "with timeout",
				timeout : 10000,
				args : async () => {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ arg : "foo" });
						}, 3000);
					});
				}
			},
			{
				name : "should skip",
				skip : true,
				args : () => {
					throw new Error("Didn't skip");
				}
			}
		]
		
		mochaLib.testArray(tests, async function(test) {
			assert.strictEqual(test.arg, "foo");
		});
	});
	
	describe("externals", function(done) {
		const tests = [
			{
				name : "after",
				args : {
					file : "after.test.js"
				}
			},
			{
				name : "example",
				args : {
					file : "example.test.js"
				}
			},
			{
				name : "only",
				args : {
					file : "only.test.js"
				}
			}
		]
		
		mochaLib.testArray(tests, async function(test) {
			return new Promise((resolve, reject) => {
				child_process.exec(`${__dirname}/../node_modules/.bin/mocha ${__dirname}/${test.file}`, function(err) {
					assert.ifError(err);
					
					return resolve();
				});
			});
		});
	});
});