const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");
const port = process.argv[2];
const rp = require("request-promise");

const nodeAddress = uuid().split("-").join("");

const bitcoin = new Blockchain();

app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extend:false});


//root
app.get("/", (req, res)=>{res.send(bitcoin)});
//get entire blockchain  블록체인 현황
app.get("/blockchain", (req, res)=>{
	res.send("bitcoin");
})

//create a new transaction 트랜잭션 생성
app.post("/transaction", (req, res)=>{
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note : `Transaction will be added in block ${blockIndex}.` });

});

//broadcast transaction  트랜잭션 브로드캐스트(전파)
app.post("/transaction/broadcast", (req, res)=>{
	const newTrnasaction = bitcoin.createNewTransaction (req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl =>{
		const requestOptions = {
			uri: networkNodeUrl + "/transaction", 
			method: "POST",
			body: newTransaction,
			json: true,
		},
			requestPromises.push(rp(requestOptions));
	});
	Promise.all(requestPromises)
	.then(data =>{
		res.json({note: `Transaction created and broadcast successfully.` });
	});
});

//mine a block 블럭 마이닝
app.get("/mine", (req, res)=>{
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData ={
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] +1;	
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl =>{
		const requestOptions ={
			uri: networkNodeUrl + "/receive-new-block",
			method: "POST",
			body: { newBlock: newBlock },
			json: true,
		};
		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data =>{
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + "/transaction/broadcast" ,
			method: "POST",
			body: {
				amount: 12.5
				sender: "00",
				recipient: nodeAddress
			},
			json: true,
		};
		return rp(requestOptions);
	})
	.then(data =>{
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});
});

// receive new block 새로운 블럭 받기
app.post("/receive-new-block", (req, res)=>{
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if(correctHash && correctIndex){
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransactions = [];
		res.json({
			note: "New block received and accepted.',
			newBlock: newBlock,
		});
	}else{
		res.json({
			note: "Newblock rejected.",
			newBlock: newBlock,
		});
	}
});

//register a node and broadcast it the network -- node 등록 및 네트워크에 브로드캐스트
app.post("/register-and-broadcast-node", (req, res)=>{
	const newNodeUrl = req.body.newNodeUrl;
	if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + "/register-node",
			method: "POST",
			body: { newNodeUrl: newNodeUrl },
			json: true,
	};
		regNodesPromises.push(rp(requestOptions));
	});
	Promise.all(regNodesPromises)
	.then(data =>{
		const bulkRegisterOptions ={
			uri: newNodeUrl + "/register-node-bulk",
			method: "POST",
			body: {allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeurl ] },
			json: true,
		};
		return rp(bulkRegisterOptions);

	}).then(data => { 
		res.json({ note: "New node registerd with network successfully." });
	});
});

// register a node with the network  -- 네트워크에 노드 등록
app.post("/register-node", (req, res)=>{
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
	if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: "New node registered successfully. " });
});

// register multiple node at once 다중노드 등록
app.post("/register-nodes-bulk", (req, res)=>{
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl =>{
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const netCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	})
	res.json({ note: "Bulk registration successful." });
});

//consensus 협의
app.get("/consensus", (req, res)=>{
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl =>{
	const requestOptions = {
		uri: networkNodeUrl + "/blockchain",
		method: "GET" ,
		// body: {},
		json: true,
	};
	requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains =>{
		const currentChainLength = bitcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain =>{
			if (blockchain.chain.length > maxChainLength){
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			}
		});

		if(!newLognestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
			res.json({
				note: "Current chain has not been replaced.",
				chain: bitcoin.chain,
			})
		}else{
			bitcoin.chain = newLongestChain;
			bitcoin.pendingTransactions = newPendingTransactions;
			res.json({
				note: "This chain has been replaced.",
				chain: bitcoin.chain,
			});
		}
	});


});


// get block by blockHash  -- 블록해시로 조회
app.get("/block/:blockHash", (req, res)=>{
	const blockHash = req.params.blockHash;
	const correctBlock = bitcoin.getBlock(blockHash);
	res.json({
		block: correctBlock
	});
});

//get transaction by transactionId  -- 트랜잭션 ID로 찾는 transaction 
app.get("/transaction/:transactionId", (req, res)=>{
	const transactionId = req.params.transactionId;
	const transactionData = bitcoin.getTransaction(transactionId);
	res.json({
		transaction: transactionData.transaction,
		block: transactionData.block
	});
});

//get address by address
app.get("/block-explorer", (req, res)=>{
	res.sendFile("./block-explorer/index.html", { root: __dirname });

});

app.listen(port, ()=>{
	console.log(`Listening on port ${port}...`);
})
