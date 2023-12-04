function formatDateString(inputDate) {
	
	if(inputDate === null){
		return null;
	}

	const dateObject = new Date(inputDate);

	const day = dateObject.getUTCDate();
	const month = dateObject.getUTCMonth() + 1;
	const year = dateObject.getUTCFullYear();

	const formattedDay = day < 10 ? `0${day}` : day;
	const formattedMonth = month < 10 ? `0${month}` : month;

	return `${formattedDay}-${formattedMonth}-${year}`;
}

module.exports = formatDateString;