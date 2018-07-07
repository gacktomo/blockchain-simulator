jsSHA = require("jssha");
var Node = require('./node');

var Network = function(num) {
  this.blockSize = 1; //MB
  this.blockTime = 60; //sec
  this.nodes = {}
  this.init(num);
}

Network.prototype.init = function(num){
  this.nodes = {}
  for(let i=0; i<num; i++){
    var id = new Date().getTime().toString(16) + Math.floor(1000*Math.random()).toString(16);
    this.nodes[id] = new Node;
  }
  var shaObj = new jsSHA("SHA-1", "TEXT");
  console.log(shaObj.getHash("HEX"))
}

module.exports = Network;