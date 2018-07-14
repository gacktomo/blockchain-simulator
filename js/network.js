Node = require('./node');
jsSHA = require("jssha");
MIN_CONNECTION = 8;

var Network = function(num) {
  this.nodes = {};
  this.init(num);
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
  //random link to 8 nodes
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
  this.node_num = Object.keys(this.nodes).length;
  this.txGenTimer = setInterval(()=>{
    let rand = Math.floor(Math.random() * 1000);
    if(TRANSACTION_FREQ < 1000){
      if(rand <= TRANSACTION_FREQ){
        this.newTransaction();
      }
    }else{
      var times = Math.floor(TRANSACTION_FREQ/1000)
      for(let i=0; i<times; i++){
        this.newTransaction();
      }
    }
  }, 1)
  this.blockGenTimer = setInterval(()=>{
    this.newBlock()
  }, 1000 * BLOCK_TIME)
  // var shaObj = new jsSHA("SHA-1", "TEXT");
  // console.log(shaObj.getHash("HEX"))
}

Network.prototype.newTransaction = function(src_id){
  var src_node_index = Math.floor(Math.random() * this.node_num);
  src_id = src_id || Object.keys(this.nodes)[src_node_index]

  var data = { 
    type: "tx",
    id: uuid(), 
    to: uuid(), 
    size: TRANSACTION_SIZE/1000, 
  }
  this.broadcast(src_id, data)
  window.dispatchEvent(new CustomEvent("new_broadcast", {
    detail:{ data: data }
  }));
}

Network.prototype.newBlock = function(src_id){
  var src_node_index = Math.floor(Math.random() * this.node_num);
  src_id = src_id || Object.keys(this.nodes)[src_node_index]

  var data = { 
    type: "inv",
    id: uuid(), 
    to: uuid(), 
    size: TRANSACTION_SIZE/1000, 
    block_number: this.nodes[src_id].block_height + 1,
  }
  data.txlist = this.nodes[src_id].genTxList()
  this.broadcast(src_id, data)
  window.dispatchEvent(new CustomEvent("new_broadcast", {
    detail:{ data: data }
  }));
}

Network.prototype.broadcast = function(src_id, data){
  for(let dist_id in this.nodes[src_id].links){
    var networkSpeed = this.nodes[src_id].networkSpeed < this.nodes[dist_id].networkSpeed ? this.nodes[src_id].networkSpeed : this.nodes[dist_id].networkSpeed
    var sendTime = (data.size * 8) / networkSpeed
    setTimeout(()=>{
      if(this.nodes[dist_id])
      this.nodes[dist_id].receiveData(data);
    }, sendTime*1000)
    window.dispatchEvent(new CustomEvent("sendData", {
      detail:{
        data: data,
        from: src_id,
        to: dist_id,
        sendTime: sendTime,
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
function uuid() {
  var uuid = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

module.exports = Network;