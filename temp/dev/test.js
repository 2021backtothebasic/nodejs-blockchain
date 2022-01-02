const Blockchain = require("./blockchain");

//인스턴스
const bitcoin = new Blockchain();

bitcoin.createNewBlock(2389, "OIUOEREDHKHKD", "78S97D4X6DSF");

console.log(bitcoin);
