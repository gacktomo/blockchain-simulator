var Chain = function() {
  let parent = document.getElementById("group1")
  this.width = window.innerWidth;
  this.height = parent.clientHeight;
  // Set pixi canvas
  this.app = new PIXI.Application(this.width, this.height, {
    transparent: true,
    antialias: true,
  });
  this.app.backgroundColor = 0xFFFFFF
  parent.appendChild(this.app.view);

  window.addEventListener("new_broadcast", (event) => { 
    if(event.detail.data.type == "inv")
      this.addBlock(event.detail.data)
  })
}

Chain.prototype.init = function(){
  this.app.stage.destroy()
}

Chain.prototype.addBlock = function(data){
  this.width += 50;
  this.app.renderer.resize(this.width, this.height);
  let box = document.getElementById("group1");
  var block = new PIXI.Graphics();
  block.lineStyle(0.5,0xffffff);
  block.drawRect(0, 0, 10, 10);
  block.endFill();
  block.x = 50 * data.block_number
  block.y = this.height/2
  let number = new PIXI.Text(data.block_number,{
    fontFamily : 'Arial', 
    fontSize: 12, 
    fill : 0xaaaaaa, 
    align : 'center'
  });
  number.x = block.x
  number.y = this.height - 20
  this.app.stage.addChild(block);
  this.app.stage.addChild(number);

  if(data.block_number>3){
    TweenMax.to(box, 0.5, { 
      scrollLeft: box.scrollLeft+50, 
    });
  }
  TweenMax.from([block,number], 0.5, { 
    x: number.x + 100, 
    alpha: 0.0,
  });
}

module.exports = Chain;