const Blockchain = require("./blockchain");


const bitcoin = new Blockchain();

bitcoin.createNewBlock(2389, "OIUOEREDHKHKD", "8s97d4x6dsf"); //채굴
bitcoin.createNewTransaction(100, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9"); //트랜잭션
bitcoin.createNewBlock(548764, "AKMC875E6S1RS9", "WPLS214R7T6SJ3G2");//채굴

bitcoin.createNewTransaction(50, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9");
bitcoin.createNewTransaction(200, "ALEXHT845SJ5TKCJ2", "JENN5BG5DF6HT8NG9");
bitcoin.createNewTransaction(300, "ALEXHT845SJ5TKCJ2", "JENN5BGDF6HT8NG9");

console.log(bitcoin);

