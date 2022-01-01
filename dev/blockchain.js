class Blockchain{
	constructor(){
	this.chain = [];
	this.newTransactions = [];
	}
}

Blockchain.prototype.createNewBlock 
	= function (nonce, previousBlockHash, hash){
		const newBlock = {
			index: this.chain.length +1,
			timestamp: Date.new(),
			transactions: this.newTransaction,
			nonce: nonce,
			hash: hash,
			previouseBlockHash: previousBlockHash,
		};
		this.newTransacion = [];
		tihs.chain.push(newBlock);
		return newBlock;
		
		
}
