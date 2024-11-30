const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility function to handle questions
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

module.exports = { askQuestion , rl };
