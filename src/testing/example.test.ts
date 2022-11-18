import { strictEqual } from "assert";
import testArray from "../testArray";

describe(__filename, function() {
	describe("test array", function() {
		const tests = [
			{
				name: "test 1",
				args: {
					num: 1,
					result: 2
				}
			},
			{
				name: "test 2",
				args: {
					num: 2,
					result: 4
				}
			}
		]

		testArray(tests, function(test) {
			strictEqual(test.num * 2, test.result);
		});
	});
});
