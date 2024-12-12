import escapeStringRegexp from "escape-string-regexp";

const OBJECT_TYPES = ["WeakMap", "WeakSet", "Promise"];
const STRUCTURED_TYPES = ["ArrayBuffer", "DataView"];
const getPrototypeString = (type) => `[object ${type}]`;

const TAB = "  ";
const ELLIPSIS = "…";
const indent = (string, count) =>
  string.replace(/^(?!\s*$)/gm, TAB.repeat(count));

const truncate = (string, len) =>
  string.length > len ? `${string.substring(0, len)}${ELLIPSIS}` : string;
const truncateArray = (array, len) =>
  array.length > len ? [...array.slice(0, len), ELLIPSIS] : array;

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

const formatCollectionType = (
  { constructor, length, size },
  showPrototype = false,
) =>
  `${constructor.name === "Array" && !showPrototype ? "" : constructor.name}(${length ?? size})`;

const formatArray = (value, options) =>
  `${formatCollectionType(value)}[${truncateArray(
    value,
    options.collectionLength,
  )
    .map((v) => format(v, options))
    .join(`, `)}]`;

const formatIterable = (value, options, showKey) =>
  `${formatCollectionType(value)} { ${truncateArray(
    [...value],
    options.collectionLength,
  )
    .map((v, i) =>
      showKey
        ? v === ELLIPSIS
          ? ELLIPSIS
          : `${i} => ${format(v, options)}`
        : format(v, options),
    )
    .join(`, `)} }`;

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
    return formatCollectionType(value, true);
  }

  const s = Object.prototype.toString.call(value);

  // Objects
  if (s === getPrototypeString("Object")) {
    if (options.level > options.depth) return `{${ELLIPSIS}}`;

    if (options.circularRefs.has(value)) return `[Circular]`;
    options.circularRefs.add(value);
    return formatObject(value, { ...options, level: options.level + 1 });
  }

  // Keyed collections
  const isMap = s === getPrototypeString("Map");
  if (isMap || s === getPrototypeString("Set")) {
    if (options.level > options.depth) return formatCollectionType(value, true);

    if (options.circularRefs.has(value)) return `[Circular]`;
    options.circularRefs.add(value);
    return formatIterable(
      value,
      { ...options, level: options.level + 1 },
      isMap,
    );
  }

  for (let i = 0; i < OBJECT_TYPES.length; i++) {
    const type = OBJECT_TYPES[i];
    if (s === getPrototypeString(type)) return `${type} {}`;
  }
  for (let i = 0; i < STRUCTURED_TYPES.length; i++) {
    const type = STRUCTURED_TYPES[i];
    if (s === getPrototypeString(type)) return `${type}(${value.byteLength})`;
  }

  if (s === getPrototypeString("RegExp"))
    return escapeStringRegexp(String(value));

  // Date, Error, Symbol
  return value?.toString?.() || s;
};

/**
 * @typedef {object} Options
 * @property {number} [depth=2] Specify levels to expand arrays and objects.
 * @property {number} [stringLength=Number.POSITIVE_INFINITY] Length to truncate strings.
 * @property {number} [collectionLength=Number.POSITIVE_INFINITY] Length to slice arrays.
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
    collectionLength: Number.POSITIVE_INFINITY,
    objectLength: Number.POSITIVE_INFINITY,
    level: 0,
    circularRefs: new WeakSet(),
    ...options,
  });

export default inspect;
