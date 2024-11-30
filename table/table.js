const ProbabilityCalculator = require('./probability.js');
// const Table = require('cli-table3');
function generateProbabilityTable(diceConfigs) {
    // Validate that diceConfigs is an array and is not empty
    if (!Array.isArray(diceConfigs) || diceConfigs.length === 0) {
        console.error("Invalid dice configurations provided.");
        return;
    }

    const table = new Table({
        head: ['User Dice v \\ Computer Dice', ...diceConfigs.map((_, i) => `Dice ${i + 1}`)],
        colWidths: [30, ...diceConfigs.map(() => 20)]
    });

    diceConfigs.forEach((userDice, userIndex) => {
        const row = [`Dice ${userIndex + 1}`];

        diceConfigs.forEach((computerDice, computerIndex) => {
            if (userIndex === computerIndex) {
                row.push('-');
            } else {
                const probabilities = ProbabilityCalculator.calculateProbability(userDice, computerDice);
                row.push(`(${probabilities.userWinProbability.toFixed(4)})\n${probabilities.computerWinProbability.toFixed(4)}`);
            }
        });

        table.push(row);
    });

    console.log("\nProbability of the win for the user:");
    console.log(table.toString());
}
module.exports = { generateProbabilityTable };