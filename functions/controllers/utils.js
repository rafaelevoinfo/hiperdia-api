var CryptoJS = require("crypto-js");

function criptografar(value){
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
}


module.exports = { criptografar };