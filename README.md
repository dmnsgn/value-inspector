# value-inspector

[![npm version](https://img.shields.io/npm/v/value-inspector)](https://www.npmjs.com/package/value-inspector)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/value-inspector)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/value-inspector)](https://bundlephobia.com/package/value-inspector)
[![dependencies](https://img.shields.io/librariesio/release/npm/value-inspector)](https://github.com/dmnsgn/value-inspector/blob/main/package.json)
[![types](https://img.shields.io/npm/types/value-inspector)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/value-inspector)](https://github.com/dmnsgn/value-inspector/blob/main/LICENSE.md)

Get a string representation of a value or an object. Pretty much like they look in Chrome DevTools.

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

![](https://raw.githubusercontent.com/dmnsgn/value-inspector/main/screenshot.png)

## Installation

```bash
npm install value-inspector
```

## Usage

```js
import inspect from "value-inspector";

const obj = {
  primitiveNull: null,

  valueUndefined: undefined,

  booleanTrue: true,

  textString: "a string",
  textRegExp: new RegExp("$ 🐈"),

  numberZero: 0,
  numberOne: 1,

  obj: {
    zero: 0,
    one: { two: 2, three: { four: 4 } },
  },

  fun() {},

  array: [0, 1],
  arrayTyped: Float32Array.of(0, 1),

  collectionMap: new Map([
    [0, "zero"],
    [1, "one"],
  ]),
  collectionSet: new Set([0, 1]),
  [Symbol("bar")]: "symbol-bar-value",

  promise: Promise.resolve(),
};

inspect(obj);

// =>
// {
//   array: (2)[0, 1]
//   arrayTyped: Float32Array(2)[0, 1]
//   booleanTrue: true
//   circularArray: [Circular]
//   circularObject: [Circular]
//   collectionMap: [object Map]
//   collectionSet: [object Set]
//   fun: [Function: fun]
//   numberOne: 1
//   numberZero: 0
//   obj: {
//     one: {
//       three: [object Object],
//       two: 2
//     },
//     zero: 0
//   }
//   primitiveNull: null
//   promise: Promise {}
//   textRegExp: /\$ 🐈/
//   textString: "a string"
//   valueUndefined: undefined
//   Symbol(bar): "symbol-bar-value"
// }
```

## API

<!-- api-start -->

## Functions

<dl>
<dt><a href="#inspect">inspect(value, [options])</a> ⇒ <code>string</code></dt>
<dd><p>Inspect a value.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="inspect"></a>

## inspect(value, [options]) ⇒ <code>string</code>

Inspect a value.

**Kind**: global function
**Returns**: <code>string</code> - A string representation of a value or an object.

| Param     | Type                             |
| --------- | -------------------------------- |
| value     | <code>\*</code>                  |
| [options] | [<code>Options</code>](#Options) |

<a name="Options"></a>

## Options : <code>object</code>

**Kind**: global typedef
**Properties**

| Name               | Type                | Default                               | Description                                  |
| ------------------ | ------------------- | ------------------------------------- | -------------------------------------------- |
| [depth]            | <code>number</code> | <code>2</code>                        | Specify levels to expand arrays and objects. |
| [stringLength]     | <code>number</code> | <code>Number.POSITIVE_INFINITY</code> | Length to truncate strings.                  |
| [collectionLength] | <code>number</code> | <code>Number.POSITIVE_INFINITY</code> | Length to slice arrays, Map and Set.         |
| [objectLength]     | <code>number</code> | <code>Number.POSITIVE_INFINITY</code> | Length to truncate object keys.              |

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/value-inspector/blob/main/LICENSE.md).
