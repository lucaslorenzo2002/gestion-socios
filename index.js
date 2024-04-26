let currentMont = new Date().getMonth()+1;

for(let i = 1; i < 13; i++){
  let month = currentMont+i
  if(month > 12){
    month = month % 12;
    if(month === 0) month =12
  }

  console.log(month)
}