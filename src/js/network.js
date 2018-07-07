Node = require('./node');
jsSHA = require("jssha");
MIN_CONNECTION = 8;

var Network = function(num) {
  this.blockSize = 1; //MB
  this.blockTime = 60; //sec
  this.nodes = {};
  this.init(num);
  this.timer = setInterval(()=>{
    var node_num = Object.keys(this.nodes).length;
    var rand = Math.floor(Math.random() * node_num);
    if(rand < node_num * 0.3){
      this.broadcast(Object.keys(this.nodes)[rand],
        { id: 1, hop: 0, size: 2, }
      )
    }
  }, 500)
  window.addEventListener("broadcast", (event) => { 
    this.broadcast(event.detail.from, event.detail.data)
  })
}

Network.prototype.init = function(num){
  this.nodes = {}
  for(let i=0; i<num; i++){
    var id = new Date().getTime().toString(16) + Math.floor(1000*Math.random()).toString(16);
    this.nodes[id] = new Node(id);
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

Network.prototype.broadcast = function(src_id, data){
  for(let dist_id in this.nodes[src_id].links){
    var networkSpeed = this.nodes[src_id].networkSpeed < this.nodes[dist_id].networkSpeed ? this.nodes[src_id].networkSpeed : this.nodes[dist_id].networkSpeed
    var sendTime = data.size / networkSpeed
    setTimeout(()=>{
      if(this.nodes[dist_id])
      this.nodes[dist_id].receiveData(data);
    }, sendTime*1000)
    window.dispatchEvent(new CustomEvent("sendData", {
      detail:{
        data: data,
        from: src_id,
        to: dist_id,
      }
    }));
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