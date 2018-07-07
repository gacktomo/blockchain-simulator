var Graph = function(nodes) {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.nodes = {};
  this.NODE_NUM = Object.keys(nodes).length;
  this.LAYOUT_TYPE = "circle";
  // Set pixi canvas
  this.app = new PIXI.Application(this.width, this.height, {
    transparent: true,
    antialias: true,
  });
  document.body.appendChild(this.app.view);
  this.setInfo();

  // Set layer containers
  this.nodes_container= new PIXI.Container();
  this.links_container= new PIXI.Container();
  this.generateTicker = new PIXI.ticker.Ticker();
  this.app.stage.addChild(this.links_container);
  this.app.stage.addChild(this.nodes_container);
  this.init(nodes);

  // Set event listners
  window.addEventListener("sendData", (event) => { 
    this.sendBlock(event.detail.from, event.detail.to, event.detail.data)
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
  this.getInfo();

  // Append Nodes
  for(let id in nodes){
    var node = new PIXI.Graphics();
    var circleSize = 50/this.NODE_NUM > 3 ? 50/this.NODE_NUM : 3;
    node.beginFill(0x589BAA);
    node.lineStyle(10/this.NODE_NUM,0xffffff);
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
  this.setInfo();
}

Graph.prototype.getInfo = function(){
  this.NODE_NUM = document.getElementById("node_num").value;
  this.LAYOUT_TYPE = document.getElementById("layout_type").value;
}

Graph.prototype.setInfo = function(){
  document.getElementById("node_num").value = this.NODE_NUM;
  document.getElementById("layout_type").value = this.LAYOUT_TYPE;
}

Graph.prototype.setNodePos = function(target){
  var len = Object.keys(this.nodes).length;
  if(this.LAYOUT_TYPE==="random") {
    var x = Math.floor( Math.random() * (this.width*0.9 + 1 - this.width*0.1) ) + this.width*0.1;
    var y = Math.floor( Math.random() * (this.height*0.9 + 1 - this.height*0.2) ) + this.height*0.2;
  }
  else if(this.LAYOUT_TYPE==="circle") {
    var r = this.width<this.height ? this.width*0.4 : this.height*0.4;
    var x = this.width*0.5 + r * Math.sin(2*Math.PI/this.NODE_NUM*len)
    var y = this.height*0.55 + r * Math.cos(2*Math.PI/this.NODE_NUM*len)
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
  console.log(link)
  this.nodes[from].links[to] = link;
  this.nodes[to].links[from] = link;
  this.links_container.addChild(this.nodes[from].links[to]);
}

Graph.prototype.sendBlock = function(from, to, data){
  var block = new PIXI.Graphics();
  var circleSize = 20/this.NODE_NUM > 3 ? 20/this.NODE_NUM : 3;
  block.beginFill(0x38F150);
  block.drawCircle(0, 0, circleSize);
  block.endFill();
  block.fillColor = "0xFF0000";
  block.x = this.nodes[from].x
  block.y = this.nodes[from].y
  this.links_container.addChild(block);

  var networkSpeed = this.nodes[from].networkSpeed < this.nodes[to].networkSpeed ? this.nodes[from].networkSpeed : this.nodes[to].networkSpeed
  var sendTime = data.size / networkSpeed
  var animTime = sendTime * 1;
  TweenMax.to(this.nodes[from].links[to], animTime, { 
    // alpha: 0.9,
    // tint: 1,
    // onComplete: function(){
    //   this.reverse(-1);
    // },
    // ease: CustomEase.create("custom", "M0,0,C0.266,0.412,0.436,0.654,0.565,0.775,0.609,0.816,0.908,0.284,1,0"),
  });
  TweenMax.to(block, animTime, { 
    x: this.nodes[to].x, 
    y: this.nodes[to].y, 
    onComplete: function(){
      block.destroy();
    },
  });
}

module.exports = Graph;