import escapeStringRegexp from "escape-string-regexp";

const objectPrototypeString = "[object Object]";
const TAB = "  ";
const ELLIPSIS = "…";
const indent = (string, count) =>
  string.replace(/^(?!\s*$)/gm, TAB.repeat(count));
const truncate = (string, len) =>
  string.length > len ? `${string.substring(0, len)}${ELLIPSIS}` : string;
const truncateArray = (array, len) =>
  array.length > len ? array.slice(0, len).concat(ELLIPSIS) : array;

const isArrayLike = (value) =>
  Array.isArray(value) ||
  (ArrayBuffer.isView(value) && typeof value.map === "function");

const formatObject = (value, options) => `{
${truncateArray(
  Object.keys(value)
    .sort((k1, k2) => (k1 < k2 ? -1 : k1 > k2 ? 1 : 0))
    .concat(
      Object.getOwnPropertySymbols(value).filter(
        (symbol) => Object.getOwnPropertyDescriptor(value, symbol).enumerable,
      ),
    ),
  options.objectLength,
)
  .map((k, i) =>
    indent(
      k === ELLIPSIS ? ELLIPSIS : `${String(k)}: ${format(value[k], options)}`,
      options.level > 1 && i !== 0 ? 0 : 1,
    ),
  )
  .join(options.level > 1 ? `,\n${TAB}` : `\n`)}
}`;

const formatArrayType = ({ constructor, length }, showPrototype = false) =>
  `${constructor.name === "Array" && !showPrototype ? "" : constructor.name}(${length})`;

const formatArray = (value, options) =>
  `${formatArrayType(value)}[${truncateArray(value, options.arrayLength)
    .map((v) => format(v, options))
    .join(`, `)}]`;

const format = (value, options) => {
  // Primitives
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const typeOf = typeof value;
  if (["number", "boolean"].includes(typeOf)) return `${value}`;

  if (typeOf === "string") {
    return value === ELLIPSIS
      ? ELLIPSIS
      : `"${truncate(value, options.stringLength)}"`;
  }
  if (typeOf === "function") return `[Function: ${value.name || "anonymous"}]`;
  if (typeOf === "bigint") return String(`${value}n`);

  // Arrays
  if (isArrayLike(value)) {
    if (options.circularRefs.has(value)) return `[Circular]`;

    options.circularRefs.add(value);
    if (options.level < options.depth) {
      return formatArray(value, { ...options, level: options.level + 1 });
    }
    return formatArrayType(value, true);
  }

  // Objects
  const s = Object.prototype.toString.call(value);
  if (s === objectPrototypeString) {
    if (options.level > options.depth) return `{${ELLIPSIS}}`;

    if (options.circularRefs.has(value)) return `[Circular]`;
    options.circularRefs.add(value);
    return formatObject(value, { ...options, level: options.level + 1 });
  }
  if (s === "[object WeakMap]") return "WeakMap {}";
  if (s === "[object WeakSet]") return "WeakSet {}";
  if (s === "[object RegExp]") return escapeStringRegexp(String(value));
  if (s === "[object ArrayBuffer]") return `Arraybuffer(${value.byteLength})`;
  if (s === "[object DataView]") return `DataView(${value.byteLength})`;
  if (s === "[object Promise]") return `Promise {}`;

  // Date, Error, Map, Set, Symbol
  return value?.toString?.() || s;
};

/**
 * @typedef {object} Options
 * @property {number} [depth=2] Specify levels to expand arrays and objects.
 * @property {number} [stringLength=Number.POSITIVE_INFINITY] Length to truncate strings.
 * @property {number} [arrayLength=Number.POSITIVE_INFINITY] Length to slice arrays.
 * @property {number} [objectLength=Number.POSITIVE_INFINITY] Length to truncate object keys.
 */

/**
 * Inspect a value.
 * @param {*} value
 * @param {Options} [options]
 * @returns {string} A string representation of a value or an object.
 */
const inspect = (value, options = {}) =>
  format(value, {
    depth: 2,
    stringLength: Number.POSITIVE_INFINITY,
    arrayLength: Number.POSITIVE_INFINITY,
    objectLength: Number.POSITIVE_INFINITY,
    level: 0,
    circularRefs: new WeakSet(),
    ...options,
  });

export default inspect;
