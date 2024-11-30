const { rl } = require('./ioUtils.js');
const { generateProbabilityTable , diceConfigs } = require('./table/table.js');

async function validateNumericInput(question, min, max, askQuestion, diceConfigs) {
    let input;
    do {
        input = await askQuestion(question);
        if (input === 'X' || input === 'x') {
            console.log("Game exited.");
            process.exit(0);
        }

        if (input === "?") {
            // If the input is '?', generate the probability table
            if (!Array.isArray(diceConfigs) || diceConfigs.length === 0) {
                console.log("Dice configurations are not valid.");
                return;
            }
            generateProbabilityTable(diceConfigs);
            return null; // Prevent further processing by returning null
        }

        input = parseInt(input, 10);
        if (isNaN(input) || input < min || input > max) {
            console.log(`Invalid input. Please enter a number between ${min} and ${max}.`);
        }
    } while (isNaN(input) || input < min || input > max);

    return input;
}
// Game logic function
async function playGameFlow(diceConfigs, generateSecureRandom, askQuestion) {
    console.log("Let's determine who makes the first move.");
    const firstMove = generateSecureRandom(2);
    console.log(`I selected a random value in the range 0..1 (HMAC=${firstMove.hmac}).`);

    let userGuess = await validateNumericInput("Try to guess my selection (0 or 1): ", 0, 1, askQuestion, diceConfigs);
    if (userGuess === null) return; // Exit early if user entered '?'
    
    console.log(`My selection: ${firstMove.randomInt} (KEY=${firstMove.key}).`);
    const userGoesFirst = userGuess === firstMove.randomInt;

    console.log(userGoesFirst ? "You make the first move!" : "I make the first move!");

    // Dice selection phase
    let userDice, computerDice;
    let diceConfigsCopy = [...diceConfigs];  // Make a copy of the diceConfigs array to avoid modifying the original

    if (userGoesFirst) {
        console.log("Choose your dice:");
        diceConfigsCopy.forEach((dice, index) => console.log(`${index}: ${dice.join(',')}`));

        const userDiceIndex = await validateNumericInput("Your selection: ", 0, diceConfigsCopy.length - 1, askQuestion, diceConfigs);
        if (userDiceIndex === null) return; // Exit early if user entered '?'
        
        userDice = diceConfigsCopy.splice(userDiceIndex, 1)[0];
        console.log(`You chose: [${userDice.join(",")}]`);

        computerDice = diceConfigsCopy.splice(0, 1)[0];
        console.log(`I choose: [${computerDice.join(",")}]`);
    } else {
        computerDice = diceConfigsCopy.splice(0, 1)[0];
        console.log(`I choose: [${computerDice.join(",")}]`);

        console.log("Choose your dice:");
        diceConfigsCopy.forEach((dice, index) => console.log(`${index}: ${dice.join(',')}`));

        const userDiceIndex = await validateNumericInput("Your selection: ", 0, diceConfigsCopy.length - 1, askQuestion, diceConfigs);
        if (userDiceIndex === null) return; // Exit early if user entered '?'
        
        userDice = diceConfigsCopy.splice(userDiceIndex, 1)[0];
        console.log(`You chose: [${userDice.join(",")}]`);
    }

    // Dice throws
    const computerThrow = generateSecureRandom(computerDice.length);
    console.log(`I selected a random value in the range 0..${computerDice.length - 1} (HMAC=${computerThrow.hmac}).`);
    const userInt = await validateNumericInput(`Add your number modulo ${computerDice.length}: `, 0, computerDice.length - 1, askQuestion, diceConfigs);
    if (userInt === null) return; // Exit early if user entered '?'

    console.log(`My number is ${computerThrow.randomInt} (KEY=${computerThrow.key}).`);
    const result = (computerThrow.randomInt + userInt) % computerDice.length;
    console.log(`The result is ${computerThrow.randomInt} + ${userInt} = ${result} (mod ${computerDice.length}).`);
    console.log(`My throw is ${computerDice[result]}.`);

    console.log("It's your turn.");
    const userThrow = generateSecureRandom(userDice.length);
    console.log(`I selected a random value in the range 0..${userDice.length - 1} (HMAC=${userThrow.hmac}).`);
    const userThrowInt = await validateNumericInput(`Add your number modulo ${userDice.length}: `, 0, userDice.length - 1, askQuestion, diceConfigs);
    if (userThrowInt === null) return; // Exit early if user entered '?'

    console.log(`My number is ${userThrow.randomInt} (KEY=${userThrow.key}).`);
    const userResult = (userThrow.randomInt + userThrowInt) % userDice.length;
    console.log(`The result is ${userThrow.randomInt} + ${userThrowInt} = ${userResult} (mod ${userDice.length}).`);
    console.log(`Your throw is ${userDice[userResult]}.`);

    // Determine winner
    const computerValue = computerDice[result];
    const userValue = userDice[userResult];

    if (userValue > computerValue) {
        console.log(`You win (${userValue} > ${computerValue})!`);
    } else if (userValue < computerValue) {
        console.log(`I win (${computerValue} > ${userValue})!`);
    } else {
        console.log("It's a tie!");
    }

    rl.close();
}

module.exports = { playGameFlow };
