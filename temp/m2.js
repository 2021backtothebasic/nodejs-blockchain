function Blockchain(){
	this.chain = [];
	this.transactions = [];
}

Blockchain.prototype.createNewblock = (nonce, previousBlockHash, hash) =>{
	const newBlock = {
		index: this.chain.length + 1, //현재 블럭넘버
		timestamp: Date.now(),  // 생성시간
		transactions: this.newTransactions, // 신규/미결 트랜젝션 블록에 추가/보관 --영속성
		nonce: nonce,  // 자격증명에서 받은 숫자값 -- 적법성 proofOfWork로 생성된 적법성
		hash: hash,  // 현재의 newBlock객체에서 온 newTransactions 값을 압축 해시하여 저장
		previousBlockHash: previousBlockHash, //이전 블록까지의 데이터를 해싱
	}
	this.newTransactions = []; // 다음 블럭을 위한 초기화
	this.chain.push(newBlock); //신규블럭을 배열에 추가
	
	return newBlock; //함수실행결과 newBlock 반환 
}
Blockchain.prototype.getLastBlock = ()=>{
	return this.chain[this.chain.length -1];
}
Blockchain.prototype.createNewTransaction = (amount, sender, recipient)=>{
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join(""),
	}
	return newTransaction;
}
Blockchain.prototype.addTransactionToPendingTransactions = (transactionObj)=>{
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index']+1;
}

Blockchain.prototype.hashBlock = (previousBlockHash, currentBlockData, nonce)=>{
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	
	return hash;
};

Blockchain.prototype.chainIsValid = (blockchain)=>{ //블럭 생성의 증명을 위한 함수
	let validChain = true; //기본값
	for(let i = 1; i < blockchain.length; i++){ //
		const currentBlock = blockchain[i]; //현재 블럭 
		const prevBlock = blockchain[i - 1]; //◀ 기존블럭 확인 ▼블럭hashing
		const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce'];
		if(blockHash.substring(0,4) !== '0000') validChain = false; // ***기준 :  0000으로 시작하는 Hash ***  아니면, 유효하지 않음.
			if(currentBlock['previousBlockHash'] !== prevBlock['hash'] validChain = false; //현재 블럭의 기존 해시가 맞지 않으면 유효하지 않음.
	};

	const genesisBlock = blockchain[0]; 
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === '0';

	if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false; //제네시스 블럭과도 매칭되지 않는 블럭이면 유효하지 않음.
	
	return validChain;  //함수실행결과 : 유효 여부값 반환
}

Blockchain.prototype.getTransaction = (transactionId)=>{ //transactionId로 조회하는 함수
	let correctTransaction = null; //초기값
	let correctBlock = null; //초기값

	/* Transaction Id를통해 transaction값과 적격여부 확인 */
	this.chain.forEach(block =>{ // 전체블럭 색인
		block.transactions.forEach(transaction =>{ 
			if(transaction.transactionId === transactionId){
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	}); 
	return {
		transaction: correctTransaction,
		block: correctBlock,
	};
};

Blockchain.prototype.getAddressData = (address)=>{
	const addressTransactions = [];
	this.chain.forEach(block =>{
		block.transactions.forEach(transaction =>{
			if(transaction.sender === address || transaction.recipient === address){
				addressTransactions.push(transaction);
			}
		}
	}
	let balance = 0;
	addressTransactions.forEach(transaction =>{
		if(transaction.recipent === address) balance += transaction.amount;

	});
	
	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};

module.exports = Blockchain;
