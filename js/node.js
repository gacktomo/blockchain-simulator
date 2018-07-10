var Node = function(id) {
  this.id = id;
  this.networkSpeed = this.normRand(NETWORK_SPEED, 10)
  this.graphObj = null;
  this.links = {};
  this.group = null;
  this.transactions = {};
  this.blocks = [];
  // console.log(this)
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