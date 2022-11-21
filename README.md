# @simpleview/mochalib

## Getting Started

```
npm install @simpleview/mochalib
```

```
const mochaLib = require("@simpleview/mochalib");
```

## Overview

Often when writing unit tests you will end up writing numerous tests which have the exact same boilerplate. In example if you are testing a templating engine you must end up with a section like follows:

```js
it("should fill with string", function() {
	assert.strictEqual(template.fill("{{data}}", { data : "foo" }), "foo");
});

it("should fill with boolean", function() {
	assert.strictEqual(template.fill("{{data}}", { data : true }), "true");
})

it("should fill with number", function() {
	assert.strictEqual(template.fill("{{data}}", { data : 10 }), "10");
});
```

In that case all 3 tests are basically doing the same thing. But there's a lot of duplicated code between each test. That can be done cleaner like so:

```js
const tests = [
	{
		name : "should fill with string",
		args : {
			data : "foo",
			result : "foo"
		}
	},
	{
		name : "should fill with boolean",
		args : {
			data : true,
			result : "true"
		}
	},
	{
		name : "should fill with number",
		args : {
			data : 10,
			result : "10"
		}
	}
]

mochaLib.testArray(tests, function(test) {
	assert.strictEqual(template.fill("{{data}}", { data : test.data }), test.result);
});
```

The more complicated the test, the more savings you get by utilizing a test array.

## API

### testArray(tests, fn)

* tests - `object[]`
	* `name` - `string` - Test name
	* `timeout` - `number` - Set a timeout in ms for this specific test.
	* `before` - `function` or `async function` - Execute a function prior to execution of the test. Executed as `await before(args)`.
	* `after` - `function` or `async function` - Execute a function after execute of the test. Executed as `await after(args)`.
	* `only` - `boolean` - Only execute this test.
	* `skip` - `boolean` - Skip this test.
	* `args` - `object` or `function` or `async function` - Definition of the test data which will be passed to the `fn`. Can be an object of data, or a function, or an async function.
* fn - `function(test)` or `async function(test)` - Receives the test args returned on `test`. If you utilize a non-async function, it must return a promise if you go off the event loop.

Basic Example

```js
const mochaLib = require("@simpleview/mochalib");
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
			},
			{
				name : "test 3",
				// returning the args from a function
				args : () => {
					return {
						num : 3,
						result : 6
					}
				}
			},
			{
				// return args from an async function with shorthand notation
				name : "test 4",
				args : async () => ({
					num : 4,
					result : 8
				})
			}
		]

		mochaLib.testArray(tests, function(test) {
			assert.strictEqual(test.num * 2, test.result);
		});
	});
});
```

Using with Typescript

```typescript
import { testArray, TestDef } from "@simpleview/mochalib";
import assert from "assert";

describe(__filename, function() {
	describe("test array", function() {
		interface Test {
			num: number
			result: number
		}

		// ensures type-checking on your test array
		const tests: TestDef<Test>[] = [
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
			},
			{
				name : "test 3",
				// returning the args from a function
				args : () => {
					return {
						num : 3,
						result : 6
					}
				}
			},
			{
				// return args from an async function with shorthand notation
				name : "test 4",
				args : async () => ({
					num : 4,
					result : 8
				})
			}
		]

		testArray<Test>(tests, function(test) {
			// now test is strictly typed
			assert.strictEqual(test.num * 2, test.result);
		});
	});
});
```
