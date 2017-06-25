const logUpdate = require('log-update');

module.exports = percent => {
    logUpdate(`Downloading [${progressBar(percent, process.stdout.columns - 14)}]`);
};

function progressBar(percent, length) {
    const barCount = (percent / 100) * length;
    const bar = [];
    for (let x = 0; x < length; x += 1) {
        bar.push(x <= barCount ? '=' : ' ');
    }
    return bar.join('');
}
