var Node = function(id) {
  this.id = id;
  this.networkSpeed = Math.floor(500*Math.random())/10; //MB/sec
  this.graphObj = null;
  this.links = {};
  this.group = null;
  this.transactions = {};
  this.blocks = [];
}

Node.prototype.receiveData = function(data){
  if(!this.transactions[data.id]){
    this.transactions[data.id] = data;
    window.dispatchEvent(new CustomEvent("broadcast", {
      detail:{
        data: data,
        from: this.id,
      }
    }));
  }
}


module.exports = Node;