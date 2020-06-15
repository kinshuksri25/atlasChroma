/*
*   Helper Functions
*/

//declaring the module
const helperFunctions = {};

//Generates a random value
//params --> valuelength - integer
//returns --> randomValue - string
helperFunctions.randValueGenerator = (valueLength = 10) => {
  let randomValue = "";
  let saltString = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
  let i = 0;
  while(i<=valueLength){
    randomValue += saltString[Math.floor((Math.random() * saltString.length))];
    i++;
  }
  return randomValue;
}

helperFunctions.generateCurrentDate = (date = new Date()) => {
  let currentDate = date;
  let currentYear = currentDate.getFullYear();
  let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
  let currentDay = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();

  currentDate = currentYear+"-"+currentMonth+"-"+currentDay;
  return currentDate;
}

//exporting the module
module.exports = {...helperFunctions};
