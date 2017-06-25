module.exports = {
    green: str => `\x1b[32m${str}\x1b[0m`,
    cyan: str => `\x1b[36m${str}\x1b[0m`,
    yellow: str => `\x1b[33m${str}\x1b[0m`,
    magenta: str => `\x1b[35m${str}\x1b[0m`,
    red: str => `\x1b[31m${str}\x1b[0m`
};
