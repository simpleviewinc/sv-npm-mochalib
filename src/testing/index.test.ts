import { strictEqual, rejects } from "assert";
import { exec, execSync } from "child_process";
import { promisify } from "util";

import testArray, { TestDef } from "../testArray";

const execP = promisify(exec);

describe(__filename, function() {
	describe("success", function() {
		interface TestArgs {
			arg: string
			p?: NodeJS.Timeout
		}

		type Test = TestDef<TestArgs>

		const tests: Test[] = [
			{
				name: "object",
				args: {
					arg: "foo"
				}
			},
			{
				name: "simple sync args",
				args: () => ({
					arg: "foo"
				})
			},
			{
				name: "async args",
				args: async () => ({
					arg: "foo"
				})
			},
			{
				name: "promise defer off event loop",
				args: () => {
					const p = new Promise<TestArgs>((resolve) => {
						setImmediate(function() {
							resolve({ arg: "foo" });
						});
					})

					return p;
				}
			},
			{
				name: "with before statement",
				before: (test) => {
					test.arg = "foo";
				},
				args: () => ({
					arg: "bar"
				})
			},
			{
				name: "with before statement and after statement that returns",
				before: async (test) => {
					test.arg += "o";

					return "valid";
				},
				after: async (test) => {
					// ensures test.arg is properly typed
					const t: string = test.arg;
					return t;
				},
				args: {
					arg: "fo"
				}
			},
			{
				name: "with before async statement",
				before: async (test) => {
					test.arg = "foo";
				},
				args: () => ({
					arg: "bar"
				})
			},
			{
				name: "with after statement",
				args: () => ({
					arg: "foo",
					p: setTimeout(() => {
						// do nothing
					}, 30000)
				}),
				after: (test) => {
					clearTimeout(test.p);
				}
			},
			{
				name: "with timeout",
				timeout: 10000,
				args: async () => {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ arg: "foo" });
						}, 3000);
					});
				}
			},
			{
				name: "should skip",
				skip: true,
				args: () => {
					throw new Error("Didn't skip");
				}
			}
		]

		testArray(tests, async function(test) {
			strictEqual(test.arg, "foo");
		});
	});

	describe("externals", function() {
		this.timeout(5000);

		const tests = [
			{
				name: "afterWithError",
				args: {
					file: "afterWithError.test.ts",
					error: /Error: Intentional/
				}
			},
			{
				name: "example",
				args: {
					file: "example.test.ts"
				}
			},
			{
				name: "only",
				args: {
					file: "only.test.ts"
				}
			}
		]

		testArray(tests, async function(test) {
			const fn = () => execP(`ts-mocha --paths '${__dirname}/${test.file}'`).catch((e) => { throw new Error(e.stdout) });

			if (test.error !== undefined) {
				return await rejects(fn, test.error)
			}

			await fn();
		});
	});

	it("Verify types", async () => {
		execSync("yarn run types", { stdio: "inherit" });
	});

	it("Run linter", async () => {
		execSync("yarn run style", { stdio: "inherit" });
	});
});
