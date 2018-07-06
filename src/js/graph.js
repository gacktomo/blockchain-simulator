var Graph = function() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.nodes = [];
  this.NODE_NUM = 5;
  this.LAYOUT_TYPE = "circle";
  // Set pixi canvas
  this.app = new PIXI.Application(this.width, this.height, {
    transparent: true,
    antialias: true,
  });
  document.body.appendChild(this.app.view);
  document.getElementById("node_num").value = this.NODE_NUM;
  document.getElementById("layout_type").value = this.LAYOUT_TYPE;

  // Set layer containers
  this.nodes_container=new PIXI.Container();
  this.links_container=new PIXI.Container();
  this.generateTicker = new PIXI.ticker.Ticker();
  this.app.stage.addChild(this.links_container);
  this.app.stage.addChild(this.nodes_container);
  this.init();
}

Graph.prototype.init = function(){
  this.width = window.innerWidth;
  this.height = window.innerHeight
  this.app.renderer.resize(this.width, this.height);
  this.nodes = [];
  this.nodes_container.destroy();
  this.links_container.destroy();
  this.nodes_container=new PIXI.Container();
  this.links_container=new PIXI.Container();
  this.app.stage.addChild(this.links_container);
  this.app.stage.addChild(this.nodes_container);
  this.NODE_NUM = document.getElementById("node_num").value;
  this.LAYOUT_TYPE = document.getElementById("layout_type").value;

  // Append Nodes
  for(let i=0; i<this.NODE_NUM; i++){
    var node = new PIXI.Graphics();
    var circleSize = 50/this.NODE_NUM > 3 ? 50/this.NODE_NUM : 3;
    node.beginFill(0x589BAA);
    node.lineStyle(10/this.NODE_NUM,0xffffff);
    node.drawCircle(0, 0, circleSize);
    node.endFill();
    node.links = {};
    this.nodes.push(node);
    this.setNodePos(i);
    this.nodes_container.addChild(node);
  }

  // Append Links
  for(let i=1; i<this.NODE_NUM; i++){
    var rand = Math.floor( Math.random() * this.NODE_NUM );
    if(!this.nodes[i].links[rand] && rand!=i)
      this.connectLink(i, rand);
  }

  // like cron
  this.generateTicker.destroy();
  this.generateTicker = new PIXI.ticker.Ticker();
  this.generateTicker.stop();
  this.generateTicker.add((delta) => {
    if( Math.floor( Math.random() * 100 ) < 10 ){
      var from = Math.floor( Math.random() * this.NODE_NUM )
      for(let k in this.nodes[from].links){
        this.sendBlock(from, k);
      }
    }
  });
  this.generateTicker.start();
  document.getElementById("node_num").value = this.NODE_NUM;
  document.getElementById("layout_type").value = this.LAYOUT_TYPE;
}

Graph.prototype.setNodePos = function(target){
  if(this.LAYOUT_TYPE==="random") {
    var x = Math.floor( Math.random() * (this.width*0.9 + 1 - this.width*0.1) ) + this.width*0.1;
    var y = Math.floor( Math.random() * (this.height*0.9 + 1 - this.height*0.2) ) + this.height*0.2;
  }
  else if(this.LAYOUT_TYPE==="circle") {
    var r = this.width<this.height ? this.width*0.4 : this.height*0.4;
    var x = this.width*0.5 + r * Math.sin(2*Math.PI/this.NODE_NUM*target)
    var y = this.height*0.55 + r * Math.cos(2*Math.PI/this.NODE_NUM*target)
  }
  this.nodes[target].x = x;
  this.nodes[target].y = y;
}

Graph.prototype.connectLink = function(from, to){
  this.nodes[from].links[to] = new PIXI.Graphics();
  this.nodes[from].links[to].lineStyle(1,0xffffff)
      .moveTo(this.nodes[from].x, this.nodes[from].y)
      .lineTo(this.nodes[to].x, this.nodes[to].y);
  this.nodes[from].links[to].endFill();
  this.nodes[from].links[to].alpha = 0.3
  this.nodes[to].links[from] = this.nodes[from]
  this.links_container.addChild(this.nodes[from].links[to]);
}

Graph.prototype.sendBlock = function(from, to){
  var block = new PIXI.Graphics();
  var circleSize = 20/this.NODE_NUM > 3 ? 20/this.NODE_NUM : 3;
  block.beginFill(0x38F150);
  block.drawCircle(0, 0, circleSize);
  block.endFill();
  block.x = this.nodes[from].x
  block.y = this.nodes[from].y
  this.links_container.addChild(block);

  TweenMax.to(block, 1, { 
    x: this.nodes[to].x, 
    y: this.nodes[to].y, 
    onComplete: function(){
      block.destroy();
    },
  });
}

module.exports = Graph;