var Graph = function(nodes) {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.nodes = {};
  // Set pixi canvas
  this.app = new PIXI.Application(this.width, this.height, {
    transparent: true,
    antialias: true,
  });
  document.body.appendChild(this.app.view);

  // Set layer containers
  this.nodes_container= new PIXI.Container();
  this.links_container= new PIXI.Container();
  this.generateTicker = new PIXI.ticker.Ticker();
  this.app.stage.addChild(this.links_container);
  this.app.stage.addChild(this.nodes_container);
  this.init(nodes);

  // Set event listners
  window.addEventListener("sendData", (event) => { 
    this.sendBlock(event.detail)
  })
}

Graph.prototype.init = function(nodes){
  this.width = window.innerWidth;
  this.height = window.innerHeight
  this.app.renderer.resize(this.width, this.height);
  this.nodes = {};
  this.nodes_container.destroy();
  this.links_container.destroy();
  this.nodes_container=new PIXI.Container();
  this.links_container=new PIXI.Container();
  this.app.stage.addChild(this.links_container);
  this.app.stage.addChild(this.nodes_container);

  // Append Nodes
  for(let id in nodes){
    var node = new PIXI.Graphics();
    var circleSize = 50/NODE_NUM > 3 ? 50/NODE_NUM : 3;
    node.beginFill(0x589BAA);
    node.lineStyle(10/NODE_NUM,0xffffff);
    node.drawCircle(0, 0, circleSize);
    node.endFill();
    node.links = {};
    node.networkSpeed = nodes[id].networkSpeed;
    this.nodes[id] = node;
    this.setNodePos(id);
    this.nodes_container.addChild(node);
  }

  // Append Links
  for(let id in nodes){
    for(let dist_id in nodes[id].links){
      if(!this.nodes[id].links[dist_id] && dist_id!=id)
        this.connectLink(id, dist_id);
    }
  }

  // like cron
  this.generateTicker.destroy();
  this.generateTicker = new PIXI.ticker.Ticker();
  this.generateTicker.stop();
  this.generateTicker.add((delta) => {
  });
  this.generateTicker.start();
}

Graph.prototype.setNodePos = function(target){
  var len = Object.keys(this.nodes).length;
  if(LAYOUT_TYPE==="random") {
    var x = Math.floor( Math.random() * (this.width*0.9 + 1 - this.width*0.1) ) + this.width*0.1;
    var y = Math.floor( Math.random() * (this.height*0.8 + 1 - this.height*0.2) ) + this.height*0.2;
  }
  else if(LAYOUT_TYPE==="circle") {
    var r = this.width<this.height ? this.width*0.3 : this.height*0.3;
    var x = this.width*0.51 + r * Math.sin(2*Math.PI/NODE_NUM*len)
    var y = this.height*0.5 + r * Math.cos(2*Math.PI/NODE_NUM*len)
  }
  this.nodes[target].x = x;
  this.nodes[target].y = y;
}

Graph.prototype.connectLink = function(from, to){
  var link = new PIXI.Graphics();
  link.lineStyle(1,0xffffff)
      .moveTo(this.nodes[from].x, this.nodes[from].y)
      .lineTo(this.nodes[to].x, this.nodes[to].y);
  link.endFill();
  link.alpha = 0.3
  this.nodes[from].links[to] = link;
  this.nodes[to].links[from] = link;
  this.links_container.addChild(this.nodes[from].links[to]);
}

Graph.prototype.sendBlock = function(event){
  var block = new PIXI.Graphics();
  var circleSize = 20/NODE_NUM > 3 ? 20/NODE_NUM : 3;
  block.beginFill(0x38F150);
  block.drawCircle(0, 0, circleSize);
  block.endFill();
  block.fillColor = "0xFF0000";
  block.x = this.nodes[event.from].x
  block.y = this.nodes[event.from].y
  this.links_container.addChild(block);

  this.nodes[event.from].links[event.to].alpha = 0.7;
  TweenMax.to(block, event.sendTime, { 
    x: this.nodes[event.to].x, 
    y: this.nodes[event.to].y, 
    onComplete: ()=>{
      block.destroy();
      if(this.nodes[event.from])
        this.nodes[event.from].links[event.to].alpha = 0.3;
    },
  });
}

module.exports = Graph;