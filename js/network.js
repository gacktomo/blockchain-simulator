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
  for(let key in this.nodes) delete this.nodes[key]
  this.nodes = {}
  this.tx_num = 0
  for(let i=0; i<num; i++){
    var id = i;
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

  // Generate Tx periodically
  let t = 1;
  let times = Math.floor(TRANSACTION_FREQ/1000)
  if(TRANSACTION_FREQ < 1000)
    t = Math.floor(1000/TRANSACTION_FREQ);
  if(this.txGenTimer) clearInterval(this.txGenTimer)
  this.txGenTimer = setInterval(()=>{
    for(let i=0; i<=times; i++){
      this.newTransaction();
    }
  }, t)

  // Generate Block periodically
  if(this.blockGenTimer) clearInterval(this.blockGenTimer)
  this.blockGenTimer = setInterval(()=>{
    for(let i=0; i<GROUP_NUM; i++)
      this.newBlock({group:i})
  }, 1000 * BLOCK_TIME)

  // var shaObj = new jsSHA("SHA-1", "TEXT");
  // console.log(shaObj.getHash("HEX"))
}

Network.prototype.newTransaction = function(src_id){
  if(!RUNNING) return;
  var src_node_index = Math.floor(Math.random() * this.node_num);
  src_id = src_id || Object.keys(this.nodes)[src_node_index]

  this.tx_num++
  var dist_addr = Math.floor(Math.random() * 1000000);
  var data = { 
    type: "tx",
    id: this.tx_num, 
    to: dist_addr, 
    group: dist_addr % GROUP_NUM,
    size: TRANSACTION_SIZE/1000, 
    gentime: ELAPSED_TIME,
    gentime_real: Date.now(),
  }
  this.broadcast(src_id, data)
  window.dispatchEvent(new CustomEvent("new_broadcast", {
    detail:{ data: data }
  }));
}

// params = {group:0, src_id:"abcdef"}
Network.prototype.newBlock = function(params={}){
  if(!RUNNING) return;
  var group = (params.group !== undefined) ? params.group : Math.floor(Math.random() * GROUP_NUM);
  var src_id;
  if(params.src_id) src_id = params.src_id
  else{
    shuffle(Object.keys(this.nodes)).forEach((id) => {
      if(this.nodes[id].group == group){
        src_id = id;
        return;
      }
    })
  }
  var data = { 
    type: "inv",
    id: uuid(), 
    to: uuid(), 
    group: this.nodes[src_id].group,
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
    data.reset_num = RESET_NUM;
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