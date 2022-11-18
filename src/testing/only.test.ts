import { strictEqual } from "assert";
import testArray from "../testArray";

describe(__filename, function() {
	const tests = [
		{
			name: "failure",
			args: () => {
				throw new Error("failure!");
			}
		},
		{
			name: "after",
			only: true,
			args: {
				foo: "fooValue"
			}
		}
	]

	testArray(tests, function(test) {
		strictEqual(test.foo, "fooValue");
	});
});
