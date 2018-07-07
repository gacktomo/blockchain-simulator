jsSHA = require("jssha");
var Node = require('./node');
MIN_CONNECTION = 8;

var Network = function(num) {
  this.blockSize = 1; //MB
  this.blockTime = 60; //sec
  this.nodes = {};
  this.init(num);
}

Network.prototype.init = function(num){
  this.nodes = {}
  for(let i=0; i<num; i++){
    var id = new Date().getTime().toString(16) + Math.floor(1000*Math.random()).toString(16);
    this.nodes[id] = new Node;
  }
  // var shaObj = new jsSHA("SHA-1", "TEXT");
  // console.log(shaObj.getHash("HEX"))

  for(let id in this.nodes){
    shuffle(Object.keys(this.nodes)).forEach((dist_id) => {
      if(Object.keys(this.nodes[id].links).length >= MIN_CONNECTION)
        return;

      if( !this.nodes[id].links[dist_id] && dist_id!=id ){
        this.nodes[id].links[dist_id] = {};
        this.nodes[dist_id].links[id] = {};
      }
    })
  }
}

function shuffle(array){
  for(var i = array.length - 1; i > 0; i--){
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}
module.exports = Network;