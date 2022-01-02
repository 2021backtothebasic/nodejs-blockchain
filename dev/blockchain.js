class Blockchain{
	constructor(){ // 1. 블록체인 생성자
	this.chain = [];
	this.newTransactions = [];
	} 
}

Blockchain.prototype.createNewBlock 
	= function (nonce, previousBlockHash, hash){ //기본속성 
		const newBlock = {
			index: this.chain.length +1,
			timestamp: Date.now(),
			transactions: this.newTransactions,
			nonce: nonce, 
			hash: hash,
			previouseBlockHash: previousBlockHash,
		};
		this.newTransacion = []; // be init
		this.chain.push(newBlock);
		return newBlock;	
}

Blockchain.prototype.createNewTransacion = (amount, sender, recipient) =>{
					/* amount : 송금하는 양 through transaction
					 * sender : 발송인 주소
					 * recipient : 수신자 주소
					 */
	const newTransaction = { //트랜젝션 객체모델 - Blockchain의 객체에 저장하는 모든 트랜젝션의 모델 minimal
		amount: amount,
		sender: sender,
		recipient: recipient,
	}; // 아직은 확정되지 않았다. (미결) --> createNewBlock메소드를 통해 검증/확정/기록된다.
}
/* 요약 - createNewTransaction 메소드는 간단히 newTransacion객체를 만들고, 
 * newTransaction 객체를 pendingTransactions 배열에 추가한다.
 * 마지막으로 newTransaction이 담길 블록의 넘버를 반환한다. 
 */


module.exports = Blockchain;
