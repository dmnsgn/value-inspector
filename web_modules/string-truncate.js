/**
 * Default separator used for truncation ("…" - horizontal ellipsis)
 * @constant {string}
 */ const DEFAULT_SEPARATOR = "…";
/**
 * Truncate a string with a custom separator in the middle (tru…ate), end (trunca…) or at any index (t…ncate).
 *
 * @param {string} string
 * @param {number} [length=10]
 * @param {import("./types.js").TruncateOptions} [options={}]
 * @returns {string}
 */ const truncate = (string, length = 10, { separator = DEFAULT_SEPARATOR, separatorIndex = Infinity } = {})=>{
    string = String(string);
    if (string.length <= length) return string;
    const contentLength = length - separator.length;
    if (contentLength <= 0) return separator.slice(0, length);
    const beforeLength = Math.max(0, Math.min(separatorIndex, contentLength));
    const afterLength = contentLength - beforeLength;
    if (afterLength <= 0) return `${string.slice(0, contentLength)}${separator}`;
    return `${string.slice(0, beforeLength)}${separator}${string.slice(-afterLength)}`;
};
/**
 * Truncate a string with the separator approximately in the middle of the resulting string.
 *
 * @param {string} string
 * @param {number} [length=10]
 * @param {import("./types.js").TruncateOptions} [options={}]
 * @returns {string}
 */ const truncateMiddle = (string, length = 10, options = {})=>truncate(string, length, {
        ...options,
        separatorIndex: Math.ceil((length - (options.separator || DEFAULT_SEPARATOR).length) / 2)
    });

export { DEFAULT_SEPARATOR, truncate, truncateMiddle };
