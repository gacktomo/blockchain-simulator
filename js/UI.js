var UI = function() {
  document.getElementById("settings_btn").addEventListener("click", ()=> { 
    this.openModal();
  });

  document.getElementById("cancel_btn").addEventListener("click", ()=> { 
    this.closeModal();
  });
}

UI.prototype.getInfo = function(){
  TRANSACTION_SIZE = document.getElementById("transaction_size").value;
  BLOCK_SIZE = document.getElementById("block_size").value;
  BLOCK_TIME = document.getElementById("block_time").value;
  NETWORK_SPEED = document.getElementById("network_speed").value;
  NODE_NUM = document.getElementById("node_num").value;
  LAYOUT_TYPE = document.getElementById("layout_type").value;
}

UI.prototype.setInfo = function(){
  document.getElementById("transaction_size").value = TRANSACTION_SIZE;
  document.getElementById("block_size").value = BLOCK_SIZE;
  document.getElementById("block_time").value = BLOCK_TIME;
  document.getElementById("network_speed").value = NETWORK_SPEED;
  document.getElementById("node_num").value = NODE_NUM;
  document.getElementById("layout_type").value = LAYOUT_TYPE;
}

UI.prototype.openModal = function(){
  document.getElementById("settings_modal").style.display = 'inline';
  TweenMax.to(document.getElementById("settings_modal"), 0.25, { 
    opacity: 1.0, 
  });
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
module.exports = UI;