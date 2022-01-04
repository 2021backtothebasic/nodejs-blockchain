function Blockchain(){
    this.chain = []; //블록체인 핵심내용저장
    this.newTransactions = []; //아직 저장되지 않은 모든 트랜잭션들을 저장
}

Blockchain.prototype.createNewBlock = (nonce, previousBlockHash, hash)=>{
    const newBlock = { //신규블럭 객체 구성
        index: this.chain.length + 1, //블럭넘버 체크
        timestamp: Date.now(), //todtjdtlwja
        transacions: tihs.newTransactions, /* 신규/미결 트랜젝션을 블록에 추가, 보관 영속성 */
        nonce: nonce, // 자격증명에서 받을 숫자값 -- proofOfWork를 통해 생성된 (적법성) 증명
        hash: hash, // 현재의 newBlock 객체에서 온 newTransactions 값을 압축 해시하여 저장 
        previousBlockHash: previousBlockHash, /* 이전블록까지의 데이터를 해싱한 값 */
        
    };
    this.newTransaction = []; /* 다음 블럭을 위해 현재 객체 초기화 */
    this.chain.push(newBlock); //신규블럭 추가
    return newBlock; //생성된 블럭 반환(다음 블럭을위한 준비까지 완료)
    //
    
};

