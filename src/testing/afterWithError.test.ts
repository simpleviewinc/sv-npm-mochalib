import testArray from "../testArray";

describe(__filename, function() {
	const tests = [
		{
			name: "after",
			args: () => ({
				p: setTimeout(() => {
					// do nothing
				}, 30000)
			}),
			// this should still fire ensuring the process closes
			after: (test) => {
				clearTimeout(test.p);
			}
		}
	]

	testArray(tests, function() {
		throw new Error("Intentional");
	});
});
