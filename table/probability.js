class ProbabilityCalculator {
    static calculateProbability(userDice, computerDice) {
        let userWins = 0;
        let computerWins = 0;
        let ties = 0;

        userDice.forEach(userValue => {
            computerDice.forEach(computerValue => {
                if (userValue > computerValue) {
                    userWins++;
                } else if (userValue < computerValue) {
                    computerWins++;
                } else {
                    ties++;
                }
            });
        });

        const totalMatches = userDice.length * computerDice.length;
        const userWinProbability = userWins / totalMatches;
        const computerWinProbability = computerWins / totalMatches;
        const tieProbability = ties / totalMatches;

        return {
            userWinProbability,
            computerWinProbability,
            tieProbability
        };
    }
}

module.exports = { ProbabilityCalculator };