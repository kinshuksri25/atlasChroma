
class DateHelper{

    constructor(){
        this.currentDateGenerator = this.currentDateGenerator.bind(this);
        this.getMonthDays = this.getMonthDays.bind(this);
    }

    currentDateGenerator(){
        let currentDateObject = {};
        currentDateObject.month = new Date().getMonth().toString() == "0" ? "01" : new Date().getMonth().toString().length == 1 ? "0"+parseInt(month)+1 :parseInt(month)+1;
        currentDateObject.year =  new Date().getFullYear();
        currentDateObject.date = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();  
        currentDateObject.time = new Date().getHours().toString().length == 2 ? new Date().getHours().toString()+":00" : "0"+new Date().getHours().toString()+":00";
        return currentDateObject;
    }
    
    getMonthDays(month = "",year = ""){
        if(month == "" || year == ""){
            let currentDateObject = this.currentDateGenerator();
            month = currentDateObject.month;
            year = currentDateObject.year;
        }
        let noOfDays = 0;
        if(month == 1 
        || month == 3 
        || month == 5 
        || month == 7 
        || month == 8
        || month == 10
        || month == 12){
                noOfDays = 31;
        } else if(month == 4 
                || month == 6
                || month == 9
                || month == 11){
                noOfDays = 30;        
        } else{
                noOfDays = year%4 && year%100 && year%400 ? 29 : 28;
        }
        return noOfDays;  
    }
}

export default DateHelper;