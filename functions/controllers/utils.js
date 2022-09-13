var CryptoJS = require("crypto-js");
const {parse, isValid} = require("date-fns");

function criptografar(value){
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
}

function iso8601ToDate(dateString){
    let date = new Date(dateString);
    if (isValid(date)){
        return date;
    }

    return null;
}

function timeStampToIso8601(timeStamp){
    if (timeStamp){
        return timeStamp.toDate();        
    }
    return null;
}


module.exports = { criptografar, iso8601ToDate, timeStampToIso8601 };