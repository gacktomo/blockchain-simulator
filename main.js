window.onload = function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var nodes = [];
  const NODE_NUM = 8;
  const POSITION_TYPE = "circle";

  // Initialize pixi canvas
  var app = new PIXI.Application(width, height, {
    transparent: true,
    antialias: true,
  });
  document.body.appendChild(app.view);
  var style = new PIXI.TextStyle({
    fontSize: 30,
    fontWeight: "bold",
    fill: 0xffffff,
  });

  // Set title
  var title = new PIXI.Text("Sharding Simulator", style);
  title.anchor.set(0.5);
  title.x = width / 2;
  title.y = 30;
  app.stage.addChild(title);

  // Set layer containers
  var nodes_container=new PIXI.Container();
  var links_container=new PIXI.Container();
  app.stage.addChild(links_container);
  app.stage.addChild(nodes_container);

  // Append Nodes
  for(let i=0; i<NODE_NUM; i++){
    var node = new PIXI.Graphics();
    node.beginFill(0x589BAA);
    node.lineStyle(2,0xffffff);
    node.drawCircle(0, 0, 15);
    node.endFill();
    node.links = {};
    nodes.push(node);
    setNodePos(i);
    nodes_container.addChild(node);
  }

  // Append Links
  for(let i=1; i<NODE_NUM; i++){
    var rand = Math.floor( Math.random() * NODE_NUM );
    if(!nodes[i].links[rand] && rand!=i)
      connectLink(i, rand);
  }

  // Change canvas size when resize event emit.
  window.addEventListener("resize", function() {
    width = window.innerWidth;
    height = window.innerHeight;
    title.x = width / 2;
    refreshGraph();
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  // like cron
  app.ticker.add((delta)=> { 
    if( Math.floor( Math.random() * 100 ) < 5 ){
      var from = Math.floor( Math.random() * NODE_NUM )
      for(key in nodes[from].links){
        sendBlock(from, key);
      }
    }
  });

  function refreshGraph(target){
    for(let i=0; i<NODE_NUM; i++){
      setNodePos(i);
    }
  }

  function setNodePos(target){
    if(POSITION_TYPE==="random") {
      var x = Math.floor( Math.random() * (width*0.9 + 1 - width*0.1) ) + width*0.1;
      var y = Math.floor( Math.random() * (height*0.9 + 1 - height*0.2) ) + height*0.2;
    }
    else if(POSITION_TYPE==="circle") {
      var r = width<height ? width : height;
      var x = width/2 + r*0.3 * Math.sin(2*Math.PI/NODE_NUM*target)
      var y = height/2 + r*0.3 * Math.cos(2*Math.PI/NODE_NUM*target)
    }
    nodes[target].x = x;
    nodes[target].y = y;
  }

  function connectLink(from, to){
    nodes[from].links[to] = new PIXI.Graphics();
    nodes[from].links[to].lineStyle(1,0xffffff)
        .moveTo(nodes[from].x, nodes[from].y)
        .lineTo(nodes[to].x, nodes[to].y);
    nodes[from].links[to].endFill();
    nodes[from].links[to].alpha = 0.5
    nodes[to].links[from] = nodes[from]
    links_container.addChild(nodes[from].links[to]);
  }

  function sendBlock(from, to){
    var block = new PIXI.Graphics();
    block.beginFill(0xD8D1B0);
    block.drawCircle(0, 0, 5);
    block.endFill();
    block.x = nodes[from].x
    block.y = nodes[from].y
    links_container.addChild(block);

    TweenMax.to(block, 1, { 
      x: nodes[to].x, 
      y: nodes[to].y, 
      onComplete: function(){
        block.destroy();
      },
    });
  }
}