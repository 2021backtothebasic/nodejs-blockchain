const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get("/", (req,res)=>{
	res.send("Hellow api");
});

app.get("/blockchain", (req, res)=>{
	res.send(bitcoin);
});

app.get("/transaction", (req, res)=>{
	const newTransaction = req.body;
	const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({note: `Transaction will be added in block ${blockIndex}.`});
	
	//console.log(req.body);	
	//res.end(`The amount of the transaction is ${req.body.amount} bitcoin`);

})
app.get("/mine", (req, res)=>{
	/* createNewBlcok 을 실행하기 위해 필요한것들...  */
	const lastBlock = bitcoin.getLastBlock();  //최근 블럭 조회
	const previousBlockHash = lastBlock['hash']; //직전 블럭 해시값
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData); //nonce값 생성
	const currentBlcokData = { // 현재블럭 정의
		transactions: bitcoin.pendingTransactions, //--미결트랜잭션
		index: lastBlock['index'] + 1  //--현재 인덱스값
	}
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

	//요건이 충족하였으므로 신규블럭생성
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);//새로운 블럭 채굴

	res.json({ //응답내용
		note: "New Block mined successfully",
		block: newBlcok
	});

	//채굴할때마다의 보상
	bitcoin.createNewTransaction(12.5, "00", nodeAddress);
})

const port = 3000;
app.listen(port, ()=>{
	console.log(` api server is running http://localhost:${port}`);
});
