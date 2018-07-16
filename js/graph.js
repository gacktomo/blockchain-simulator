var Graph = function(nodes) {
  this.width = 200;
  this.height = 200
  this.nodes = {};
  this.init(nodes);

  // Set event listners
  window.addEventListener("sendData", (event) => { 
    if(GRAPH_VISIBLE==1)
      this.sendData(event.detail)
  })
}

Graph.prototype.init = function(nodes){
  if(this.app && this.app.stage) this.app.destroy(true)
  if(!GRAPH_VISIBLE) return;
  this.width = 200;
  this.height = 200
  this.app = new PIXI.Application(this.width, this.height, {
    transparent: true,
    antialias: true,
  });
  document.getElementById("graph-area").appendChild(this.app.view);
  this.app.renderer.resize(this.width, this.height);
  this.nodes = {};
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

Graph.prototype.sendData = function(event){
  var block = new PIXI.Graphics();
  var circleSize = 20/NODE_NUM > 3 ? 20/NODE_NUM : 3;
  if(event.data.type == "tx")
    block.beginFill(0x38F150);
  else if(event.data.type == "inv")
    block.beginFill(0xc62c2c);
  block.drawCircle(0, 0, circleSize);
  block.endFill();
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