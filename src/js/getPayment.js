export default function getPayment(cardNumber) {
  const prefixes = {
    visa: /^(4)/,
    mastercard: /^(51|52|53|54|55)/,
    americanExpress: /^(34|37)/,
    discover: /^(60)/,
    jcb: /^(31|35)/,
    diners: /^(30|36|38)/,
    mir: /^(2)/,
  };

  for (const [system, prefix] of Object.entries(prefixes)) {
    if (prefix.test(cardNumber)) {
      return system;
    }
  }

  return 'unknown';
}
