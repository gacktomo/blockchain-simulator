var Chain = function() {
  let parent = document.getElementById("group1")
  this.width = window.innerWidth;
  this.height = parent.clientHeight;
  this.app = new PIXI.Application(this.width, this.height, {
    transparent: true,
    antialias: true,
  });
  this.app.backgroundColor = 0xFFFFFF
  this.main_container=new PIXI.Container();
  this.app.stage.addChild(this.main_container);
  parent.appendChild(this.app.view);

  window.addEventListener("new_broadcast", (event) => { 
    if(event.detail.data.type == "inv")
      this.addBlock(event.detail.data)
  })
}

Chain.prototype.init = function(){
  document.getElementById("group1").scrollLeft = 0;
  this.main_container.destroy();
  this.main_container=new PIXI.Container();
  this.app.stage.addChild(this.main_container);
}

Chain.prototype.addBlock = function(data){
  this.width += 50;
  this.app.renderer.resize(this.width, this.height);
  let box = document.getElementById("group1");
  let block = new PIXI.Graphics();
  let block_w = 10;
  block.lineStyle(0.5,0xffffff);
  block.drawRect(0, 0, block_w, block_w);
  block.endFill();
  block.x = 50 * data.block_number + 50;
  block.y = this.height/2
  let number = new PIXI.Text("#"+data.block_number,{
    fontFamily : 'Arial', 
    fontSize: 12, 
    fill : 0xaaaaaa, 
    align : 'center'
  });
  number.x = block.x
  number.y = this.height - 20
  if(data.block_number>0){
    var line = new PIXI.Graphics();
    line.lineStyle(0.5,0xffffff)
        .moveTo(block.x, block.y+block_w/2)
        .lineTo(block.x-50+block_w, block.y+block_w/2);
    line.endFill();
    this.main_container.addChild(line);
  }
  this.main_container.addChild(block);
  this.main_container.addChild(number);

  if(this.width / window.innerWidth > 1.5){
    TweenMax.to(box, 0.5, { 
      scrollLeft: block.x-window.innerWidth/2, 
    });
  }
  TweenMax.from([block,number], 0.5, { 
    x: number.x + 100, 
    alpha: 0.0,
  });
  TweenMax.from(line, 0.5, { 
    alpha: 0.0,
  });
}

module.exports = Chain;