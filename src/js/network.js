var Node = require('./node');

var Network = function(num) {
  this.nodes = {}
  for(let i=0; i<num; i++){
    var id = new Date().getTime().toString(16);
    this.nodes[id] = new Node;
  }
}

Network.prototype.init = function(){
}

module.exports = Network;