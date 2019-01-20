var UI = function() {
  document.getElementById("settings_btn").addEventListener("click", ()=> { 
    this.openModal();
  });
  document.getElementById("cancel_btn").addEventListener("click", ()=> { 
    this.closeModal();
  });
  document.getElementById("running_btn").addEventListener("click", function() { 
    RUNNING = !RUNNING;
    if(RUNNING)
      this.innerHTML = "stop"
    else
      this.innerHTML = "start"
  });
  window.addEventListener("new_broadcast", (event) => { 
    this.setResult(event.detail.data)
    this.addConsole(event.detail.data)
  })
  window.addEventListener("broadcast", (event) => { 
    let data = event.detail.data
    if(data.type == "tx"){
      if(TX_RECIEVE_LIST[data.id]){
        TX_RECIEVE_LIST[data.id] += 1;
      }else{
        TX_RECIEVE_LIST[data.id] = 1;
      }
      if(TX_RECIEVE_LIST[data.id] >= NODE_NUM){
        console.log(`all received TX ${data.id}`)
        console.log(Date.now()-data.gentime_real)
        delete TX_RECIEVE_LIST[data.id];

        row_latency = (TX_PROP_LATENCY * (data.id-1) + (Date.now() - data.gentime_real))/data.id
        TX_PROP_LATENCY = Math.floor(row_latency*100)/100
        document.getElementById("tx_prop_latency").innerHTML = TX_PROP_LATENCY
      }
    }
    if(data.type == "inv"){
      if(BLOCK_RECIEVE_LIST[data.block_number]){
        BLOCK_RECIEVE_LIST[data.block_number] += 1;
      }else{
        BLOCK_RECIEVE_LIST[data.block_number] = 1;
      }
      
      if(BLOCK_RECIEVE_LIST[data.block_number] >= NODE_NUM * GROUP_NUM){
        console.log(`all broadcasted ${data.block_number}`)
        delete BLOCK_RECIEVE_LIST[data.block_number];

        let diff = 0;
        for(txid in data.txlist){
          diff += (ELAPSED_TIME - data.txlist[txid].gentime)
        }
        data.txlist = data.txlist || {};
        CONFIRMED_TX_NUM = Object.keys(data.txlist).length;
        WORST_TX_LATENCY = Math.floor(diff/CONFIRMED_TX_NUM*100)/100
        document.getElementById("worst_tx_latency").innerHTML = WORST_TX_LATENCY
      }
    }
  })
}

UI.prototype.init = function(){
  window.CONFIRMED_TX_NUM = 0;
  window.ELAPSED_TIME = 0;
  window.BLOCK_HEIGHT = 0;
  window.THROUGHPUT = 0;
  window.ATTACK_LISK = 0;
  window.TX_LATENCY = 0;
  window.TX_PROP_LATENCY = 0;
  window.WORST_TX_LATENCY = 0;
  this.setInfo();
  this.initChainArea();
  document.getElementById("footer").innerHTML = ""
}

UI.prototype.initChainArea = function(){
  let chain_area = document.getElementById("chain_area")
  chain_area.innerHTML = "";
  for(let i=0; i<GROUP_NUM; i++){
    chain_area.insertAdjacentHTML('beforeend',
      `
      <div id='group${i}' class='chain-box'>
        <p class='chain-title'>group ${i+1}</p>
        <svg id='group${i}-svg'/>
      </div>
      `
    );
  }
}

UI.prototype.setResult = function(data){
  if(data.type == "inv"){
    if(BLOCK_HEIGHT < data.block_number){
      BLOCK_HEIGHT = data.block_number
      document.getElementById("block_height").innerHTML = "#"+BLOCK_HEIGHT;
    }
    
    let diff = 0;
    let sum = TX_LATENCY * CONFIRMED_TX_NUM
    for(txid in data.txlist){
      diff += (ELAPSED_TIME - data.txlist[txid].gentime)
    }
    data.txlist = data.txlist || {};
    CONFIRMED_TX_NUM += Object.keys(data.txlist).length;
    TX_LATENCY = Math.floor((sum + diff)/CONFIRMED_TX_NUM*100)/100
    document.getElementById("tx_latency").innerHTML = TX_LATENCY

    THROUGHPUT = Math.floor(CONFIRMED_TX_NUM/(ELAPSED_TIME+1)*10)/10;
    document.getElementById("throughput").innerHTML = THROUGHPUT
  }
}

UI.prototype.getInfo = function(){
  TRANSACTION_SIZE = document.getElementById("transaction_size").value;
  TRANSACTION_FREQ = document.getElementById("transaction_freq").value;
  BLOCK_SIZE = document.getElementById("block_size").value;
  BLOCK_TIME = document.getElementById("block_time").value;
  NETWORK_SPEED = document.getElementById("network_speed").value;
  NODE_NUM = document.getElementById("node_num").value;
  GROUP_NUM = document.getElementById("group_num").value;
  LAYOUT_TYPE = document.getElementById("layout_type").value;
  GRAPH_VISIBLE = document.getElementById("graph_visible").checked;
}

UI.prototype.setInfo = function(){
  document.getElementById("transaction_size").value = TRANSACTION_SIZE;
  document.getElementById("transaction_freq").value = TRANSACTION_FREQ;
  document.getElementById("block_size").value = BLOCK_SIZE;
  document.getElementById("block_time").value = BLOCK_TIME;
  document.getElementById("network_speed").value = NETWORK_SPEED;
  document.getElementById("node_num").value = NODE_NUM;
  document.getElementById("group_num").value = GROUP_NUM;
  document.getElementById("layout_type").value = LAYOUT_TYPE;
  document.getElementById("graph_visible").checked = GRAPH_VISIBLE;
  document.getElementById("block_height").innerHTML = "#"+BLOCK_HEIGHT;
  document.getElementById("throughput").innerHTML = THROUGHPUT
  document.getElementById("attack_lisk").innerHTML = ATTACK_LISK
  document.getElementById("tx_latency").innerHTML = TX_LATENCY
  document.getElementById("worst_tx_latency").innerHTML = WORST_TX_LATENCY
  document.getElementById("tx_prop_latency").innerHTML = TX_PROP_LATENCY
}

UI.prototype.addConsole = function(data){
  if(data.type == "tx"){
    document.getElementById("footer").insertAdjacentHTML('afterbegin',
      `<div>Broadcasted new <span style="color:#38F150;">Transaction</span> ${data.id}</div>`
    );
  }else if(data.type == "inv"){
    document.getElementById("footer").insertAdjacentHTML('afterbegin',
      `<div>Broadcasted new <span style="color:#c62c2c;">Block</span> Group${data.group+1} - #${data.block_number}</div>`
    );
  }
}

UI.prototype.openModal = function(){
  document.getElementById("settings_modal").style.display = 'inline';
  TweenMax.to(document.getElementById("settings_modal"), 0.25, { 
    opacity: 1.0, 
  });
}
UI.prototype.closeModal = function(){
  TweenMax.to(document.getElementById("settings_modal"), 0.25, { 
    opacity: 0.0, 
    onComplete: ()=>{
      document.getElementById("settings_modal").style.display = 'none';
    },
  });
}

UI.prototype.openFooter = function(){
  TweenMax.to(document.getElementById("footer"), 0.3, { 
    height: "100px", 
  });
}
UI.prototype.closeFooter = function(){
  TweenMax.to(document.getElementById("footer"), 0.3, { 
    height: "50px", 
  });
}

module.exports = UI;