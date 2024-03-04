export function paymentMethods(paymentMethod, paymentType) {
    if (paymentMethod === 'account_money') {
        return 'TRANSFERENCIA';
    }
    else if (paymentMethod === 'master' && paymentType === 'credit_card') {
        return 'MASTERCARD CREDITO';
    }
}
//# sourceMappingURL=paymentMethods.js.map