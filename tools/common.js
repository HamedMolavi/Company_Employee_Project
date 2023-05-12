module.exports = {
    rgx: (pattern) => new RegExp(`.*${pattern}.*`),
    checkDBResult: (results) => (Array.isArray(results) && !!results.length) || !!Object.keys(results).length,

}
