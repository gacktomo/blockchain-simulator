var UI = function() {
  document.getElementById("settings_btn").addEventListener("click", ()=> { 
    this.openModal();
  });

  document.getElementById("cancel_btn").addEventListener("click", ()=> { 
    this.closeModal();
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