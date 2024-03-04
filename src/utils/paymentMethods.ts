export function paymentMethods(paymentMethod: string, paymentType: string){
	if(paymentMethod === 'account_money'){
		return 'TRANSFERENCIA';
	}else if(paymentMethod === 'master' && paymentType === 'credit_card'){
		return 'MASTERCARD CREDITO';
	}   
}