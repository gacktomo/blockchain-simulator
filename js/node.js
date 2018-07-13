var Node = function(id) {
  this.id = id;
  this.networkSpeed = this.normRand(NETWORK_SPEED, 10)
  this.graphObj = null;
  this.links = {};
  this.group = null;
  this.transactions = {};
  this.block_height = 0;
}

Node.prototype.genTxList = function(data){
  let tx_num = 0;
  let tx_list = {}
  for(txid in this.transactions){
    tx_num += 1;
    if(tx_num < BLOCK_SIZE*1000/TRANSACTION_SIZE){
      tx_list[txid] = this.transactions[txid]
      delete this.transactions[txid];
      // ToDo - Tx exec order
    }else{
      return tx_list
    }
  }
}

Node.prototype.receiveData = function(data){
  if(data.type == "tx"){
    if(!this.transactions[data.id]){
      this.transactions[data.id] = data;
      window.dispatchEvent(new CustomEvent("broadcast", {
        detail:{
          data: data,
          from: this.id,
        }
      }));
    }
  }else if(data.type == "inv"){
    // ToDo - contain block number in data when generate block
    if(data.block_number > this.block_height){
      this.block_height = data.block_number
      for(txid in this.data.tx_list){
        delete this.transaction[txid]
      }
    }
  }
}

Node.prototype.normRand = function (m, s) {
  var a = 1 - Math.random();
  var b = 1 - Math.random();
  var c = Math.sqrt(-2 * Math.log(a));
  if(0.5 - Math.random() > 0) {
      return c * Math.sin(Math.PI * 2 * b) * s + m;
  }else{
      return c * Math.cos(Math.PI * 2 * b) * s + m;
  }
}

module.exports = Node;