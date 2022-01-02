const Blockchain = require("./blockchain");

//인스턴스
const bitcoin = new Blockchain();

bitcoin.createNewBlock();

console.log(bitcoin);
