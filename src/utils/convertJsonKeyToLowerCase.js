module.exports = function convertFirstLetterToLowercase(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertFirstLetterToLowercase);
    }

    return Object.keys(obj).reduce((acc, key) => {
        const lowercaseKey = key.charAt(0).toLowerCase() + key.slice(1);
        acc[lowercaseKey] = convertFirstLetterToLowercase(obj[key]);
        return acc;
    }, {});
}