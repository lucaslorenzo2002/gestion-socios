export function paymentMethods(paymentMethod, paymentType) {
    if (paymentMethod === 'account_money') {
        return 'TRANSFERENCIA';
    }
    else if (paymentMethod === 'master' && paymentType === 'credit_card') {
        return 'MASTERCARD CREDITO';
    }
    else if (paymentMethod === 'visa' && paymentType === 'credit_card') {
        return 'VISA CREDITO';
    }
    else if (paymentMethod === 'debmaster' && paymentType === 'debit_card') {
        return 'MASTERCARD DEBITO';
    }
    else if (paymentMethod === 'debvisa' && paymentType === 'debit_card') {
        return 'VISA DEBITO';
    }
    else if (paymentMethod === 'amex' && paymentType === 'credit_card') {
        return 'AMERICAN EXPRESS CREDITO';
    }
}
//# sourceMappingURL=paymentMethods.js.map