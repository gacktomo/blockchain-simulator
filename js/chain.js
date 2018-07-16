var Chain = function() {
  let parent = document.getElementById("group1")
  this.width = window.innerWidth;
  this.height = parent.clientHeight;
  this.snap = Snap("#group1-svg");

  window.addEventListener("new_broadcast", (event) => { 
    if(event.detail.data.type == "inv")
      this.addBlock(event.detail.data)
  })
}

Chain.prototype.init = function(){
  document.getElementById("group1").scrollLeft = 0;
  this.snap.clear();
}

Chain.prototype.addBlock = function(data){
  let box = document.getElementById("group1");
  this.width += 50;
  this.snap.attr({ width: this.width, });
  let block_w = 20;
  let _x = 50 * data.block_number + 50;
  let _y = this.height/2
  let block = this.snap.rect(_x+100, _y, block_w, block_w);
  block.attr({
    fill: "#1a1924",
    stroke: "#ffffff",
    strokeWidth: 0.5,
    opacity: 0.0,
  });
  let number = this.snap.text(_x, this.height-20, "#"+data.block_number);
  number.attr({
    stroke: "#888888",
    opacity: 0.0,
    'font-size': "12px",
  });
  if(data.block_number>0){
    var line = this.snap.line(_x, _y+block_w/2, _x-50+block_w, _y+block_w/2);
    line.attr({
      stroke: "#888888",
      opacity: 0.0,
    });
    line.animate({x: _x, opacity: 1.0}, 1000, mina.easeinout);
  }

  if(this.width / window.innerWidth > 1.5){
    TweenMax.to(box, 0.5, { 
      scrollLeft: _x-window.innerWidth/2, 
    });
  }
  block.animate({x: _x, opacity: 1.0}, 1000, mina.easeinout);
  number.animate({x: _x, opacity: 1.0}, 1000, mina.easeinout);
  TweenMax.from(block, 0.5, { 
    attr:{
      x: 100
    }
  });
}

module.exports = Chain;