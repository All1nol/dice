const { askQuestion } = require('./ioUtils.js');
const { generateSecureRandom } = require('./cryptoUtils.js');
const { playGameFlow } = require('./playGameFlow.js');
const { parseDiceConfigs } = require('./diceUtils.js');

// Parse dice configurations from command-line arguments
const diceConfigs = parseDiceConfigs(process.argv.slice(2));

if (diceConfigs.length < 2) {
    console.error("At least two dice must be provided.");
    process.exit(1);
}

console.log("Dice configurations:");
diceConfigs.forEach((dice, index) => console.log(`${index}: ${dice.join(',')}`));

// Start the game
playGameFlow(diceConfigs, generateSecureRandom, askQuestion);
