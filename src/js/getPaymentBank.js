export default function getPaymentBank(cardNumber) {
    const prefixes = {
        'visa': /^(49|44|45)/,
        'mastercard': /^(52|53|54)/,
        'american-express': /^(34|37)/,
        'discover': /^(6011)/,
        'jcb': /^35/,
        'diners': /^36/,
        'mir': /^(22|24|25)/
    };

    for (const [system, prefix] of Object.entries(prefixes)) {
        if (prefix.test(cardNumber)) {
            return system;
        }
    }

    return 'unknown';
}