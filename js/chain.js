var Chain = function() {
  this.snap = [];
  window.addEventListener("new_broadcast", (event) => { 
    if(event.detail.data.type == "inv")
      this.addBlock(event.detail.data)
  })
}

Chain.prototype.init = function(){
  let parent = document.getElementById("group0")
  this.width = window.innerWidth;
  this.height = parent.clientHeight;
  for(let i in this.snap){
    this.snap[i].clear();
  }
  this.snap = [];
  for(let i=0; i<GROUP_NUM; i++){
    this.snap[i] = Snap(`#group${i}-svg`);
    document.getElementById(`group${i}`).scrollLeft = 0;
  }
}

Chain.prototype.addBlock = function(data){
  let group = data.group
  let box = document.getElementById("group"+data.group);
  this.width += 50;
  this.snap[group].attr({ width: this.width, });
  let block_w = 20;
  let _x = 50 * data.block_number + 50;
  let _y = this.height/2

  let block = this.snap[group].rect(_x+100, _y, block_w, block_w);
  block.attr({
    fill: "#1a1924",
    stroke: "#ffffff",
    strokeWidth: 0.5,
    opacity: 0.0,
  });
  block.animate({x: _x, opacity: 1.0}, 1000, mina.easeinout);

  let number = this.snap[group].text(_x, _y-20, "#"+data.block_number);
  number.attr({
    stroke: "#888888",
    opacity: 0.0,
    'font-size': "10px",
  });
  number.animate({x: _x, opacity: 1.0}, 1500, mina.easeinout);

  if(data.block_number>0){
    var line = this.snap[group].line(_x, _y+block_w/2, _x-50+block_w, _y+block_w/2);
    line.attr({
      stroke: "#888888",
      opacity: 0.0,
    });
    line.animate({x: _x, opacity: 1.0}, 1500, mina.easeinout);
  }

  if(this.width / window.innerWidth > 1.5){
    TweenMax.to(box, 1, { 
      scrollLeft: _x-window.innerWidth/2, 
    });
  }
}

module.exports = Chain;