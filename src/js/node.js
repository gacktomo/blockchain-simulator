var Node = function() {
  this.graphObj = null;
  this.links = {};
  this.group = null;
  this.transactions = [];
  this.blocks = [];
}

Node.prototype.init = function(){
}

module.exports = Node;