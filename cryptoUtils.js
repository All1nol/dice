const crypto = require('crypto');

// Helper function to generate a secure random number and HMAC
function generateSecureRandom(range) {
    const key = crypto.randomBytes(32).toString('hex'); // 256-bit key
    let randomInt;
    let hmac;

    do {
        randomInt = crypto.randomBytes(4).readUInt32BE(0);
    } while (randomInt >= Math.floor(0xFFFFFFFF / range) * range);

    randomInt = randomInt % range;
    hmac = crypto.createHmac('sha3-256', key).update(String(randomInt)).digest('hex');

    return { key, randomInt, hmac };
}

module.exports = { generateSecureRandom };
