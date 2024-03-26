import escapeStringRegexp from "escape-string-regexp";

const objectPrototypeString = "[object Object]";
const TAB = "  ";
const indent = (string, count) =>
  string.replace(/^(?!\s*$)/gm, TAB.repeat(count));

const isArrayLike = (value) =>
  Array.isArray(value) ||
  (ArrayBuffer.isView(value) && typeof value.map === "function");

const formatObject = (value, options) => `{
${Object.keys(value)
  .sort((k1, k2) => (k1 < k2 ? -1 : k1 > k2 ? 1 : 0))
  .concat(
    Object.getOwnPropertySymbols(value).filter(
      (symbol) => Object.getOwnPropertyDescriptor(value, symbol).enumerable,
    ),
  )
  .map((k, i) =>
    indent(
      `${String(k)}: ${format(value[k], options)}`,
      options.level > 1 && i !== 0 ? 0 : 1,
    ),
  )
  .join(options.level > 1 ? `,\n${TAB}` : `\n`)}
}`;

const formatArrayType = ({ constructor, length }, showPrototype = false) =>
  `${constructor.name === "Array" && !showPrototype ? "" : constructor.name}(${length})`;

const formatArray = (value, options) =>
  `${formatArrayType(value)}[${value.map((v) => format(v, options)).join(`, `)}]`;

const format = (value, options) => {
  // Primitives
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const typeOf = typeof value;
  if (["number", "boolean"].includes(typeOf)) return `${value}`;

  if (typeOf === "string") return `"${value}"`;
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
    if (options.level > options.depth) return objectPrototypeString;

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
 * @property {number} depth Specify levels to expand arrays and objects.
 */

/**
 * Inspect a value.
 * @param {*} value
 * @param {Options} [options]
 * @returns {string} A string representation of a value or an object.
 */
const inspect = (value, options = { depth: 2 }) =>
  format(value, { ...options, level: 0, circularRefs: new WeakSet() });

export default inspect;
