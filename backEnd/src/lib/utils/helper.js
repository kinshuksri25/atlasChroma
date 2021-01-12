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

helperFunctions.generateCurrentDate = () => {
  let currentDateObject = {};
  currentDateObject.month = new Date().getMonth().toString().length == 1 ? "0"+(parseInt(new Date().getMonth())+1) : (parseInt(new Date().getMonth())+1);
  currentDateObject.year =  new Date().getFullYear();
  currentDateObject.date = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();  
  currentDateObject.time = new Date().getHours().toString()+":00";

  let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
  return currentDate;
}

helperFunctions.generateCurrentTime = () => {
  let time = new Date().getHours().toString().length == 1 ? "0"+new Date().getHours().toString()+":00" : new Date().getHours().toString()+":00";
  return time;
}


helperFunctions.interpolate = (str,data) => {

	str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !==null ? data : {};

	//for each key in the data object, 
	//insert its value into the string at the corresponding placeholder
	for(var key in data)
	{
		if(data.hasOwnProperty(key) && typeof(data[key]) == 'string')
		{
			var replace = data[key];
			var find = '{'+key+'}';
			str = str.replace(find,replace);
		}
	}
	return str;
};

//exporting the module
module.exports = {...helperFunctions};
