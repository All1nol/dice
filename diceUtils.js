// Helper function to parse dice configurations from command-line arguments
function parseDiceConfigs(args) {
    return args.map(arg => arg.split(',').map(Number));
}

module.exports = { parseDiceConfigs };
