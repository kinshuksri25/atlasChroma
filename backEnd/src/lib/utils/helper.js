//Dependencies

//declaring the module
const helperFunctions = {};

helperFunctions.randValueGenerator = (valueLength = 10) => {
  let randomValue = "";
  let saltString = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
  let i = 0;
  while(i<=valueLength){
    randomValue += saltString[Math.floor((Math.random() * saltString.length) + 1)];
    i++;
  }
  return randomValue;
}

//exporting the module
module.exports = {...helperFunctions};
