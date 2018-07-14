var UI = function() {
  document.getElementById("settings_btn").addEventListener("click", ()=> { 
    this.openModal();
  });
  document.getElementById("cancel_btn").addEventListener("click", ()=> { 
    this.closeModal();
  });
  window.addEventListener("new_broadcast", (event) => { 
    this.setResult(event.detail.data)
    this.addConsole(event.detail.data)
  })
}

UI.prototype.setResult = function(data){
  if(data.type == "inv"){
    if(BLOCK_HEIGHT < data.block_number){
      BLOCK_HEIGHT = data.block_number
      document.getElementById("block_height").innerHTML = "#"+BLOCK_HEIGHT;
    }
    data.txlist = data.txlist || {};
    CONFIRMED_TX_NUM += Object.keys(data.txlist).length;
    THROUGHPUT = Math.floor(CONFIRMED_TX_NUM/ELAPSED_TIME*10)/10;
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
  LAYOUT_TYPE = document.getElementById("layout_type").value;
}

UI.prototype.setInfo = function(){
  document.getElementById("transaction_size").value = TRANSACTION_SIZE;
  document.getElementById("transaction_freq").value = TRANSACTION_FREQ;
  document.getElementById("block_size").value = BLOCK_SIZE;
  document.getElementById("block_time").value = BLOCK_TIME;
  document.getElementById("network_speed").value = NETWORK_SPEED;
  document.getElementById("node_num").value = NODE_NUM;
  document.getElementById("layout_type").value = LAYOUT_TYPE;
  document.getElementById("block_height").innerHTML = "#"+BLOCK_HEIGHT;
  document.getElementById("throughput").innerHTML = THROUGHPUT
  document.getElementById("attack_lisk").innerHTML = ATTACK_LISK
  document.getElementById("tx_latency").innerHTML = TX_LATENCY
}

UI.prototype.addConsole = function(data){
  if(data.type == "tx"){
    document.getElementById("footer").insertAdjacentHTML('afterbegin',
      `<div>Broadcasted new <span style="color:#38F150;">Transaction</span> ${data.id}</div>`
    );
  }else if(data.type == "inv"){
    document.getElementById("footer").insertAdjacentHTML('afterbegin',
      `<div>Broadcasted new <span style="color:#c62c2c;">Block</span> ${data.id}</div>`
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