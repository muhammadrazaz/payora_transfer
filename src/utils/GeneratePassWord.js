const rn = require('random-number');
module.exports = () => {
    let password = '';

    while (true) { 
        password = '';
        const length = 10 // Random length between 8 and 17
        let hasDigit = false;
        let hasLetter = false;

        for (let i = 0; i < length; i++) {
            let char;
            const charCode = rn({ min: 0, max: 61, integer: true }); // Random character code between 0 and 61
            if (charCode < 10) {
                char = String.fromCharCode(charCode + 48); // Map digit (0-9) to character code (48-57)
                hasDigit = true;
            } else if (charCode < 36) {
                char = String.fromCharCode(charCode + 55); // Map uppercase letter (A-Z) to character code (65-90)
                hasLetter = true;
            } else {
                char = String.fromCharCode(charCode + 61); // Map lowercase letter (a-z) to character code (97-122)
                hasLetter = true;
            }
            password += char;
        }

        if (hasDigit && hasLetter) {
            break;
        }
    }

    return password;
}