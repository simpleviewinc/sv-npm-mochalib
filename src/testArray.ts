export type HookFn<T> = (test: T) => (any | Promise<any>)

export interface TestDef<T = any>{
	name: string
	timeout?: number
	before?: HookFn<T>
	after?: HookFn<T>
	only?: boolean
	skip?: boolean
	args: T | (() => T) | (() => Promise<T>)
}

export interface TestFn<T = any> {
	(test: T): any | Promise<any>
}

/**
 * Execute an array of tests using the same runner to execute each test
 */
export default function testArray<T = any>(tests: TestDef[], fn: TestFn<T>) {
	tests.forEach(function(test, i) {
		const testFn = test.skip ? it.skip : test.only ? it.only : it;

		testFn(test.name, async function() {
			if (test.timeout !== undefined) {
				this.timeout(test.timeout);
			}

			const testArgs = test.args instanceof Function ? await test.args() : test.args;

			if (test.before !== undefined) {
				await test.before(testArgs);
			}

			try {
				await fn(testArgs);
			} finally {
				if (test.after !== undefined) {
					await test.after(testArgs);
				}
			}
		});
	});
}
