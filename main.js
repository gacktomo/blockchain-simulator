window.onload = function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var nodes = [];
  var NODE_NUM = 5;
  const POSITION_TYPE = "circle";
  // const POSITION_TYPE = "random";

  // Set pixi canvas
  var app = new PIXI.Application(width, height, {
    transparent: true,
    antialias: true,
  });
  document.body.appendChild(app.view);

  // Set layer containers
  var nodes_container=new PIXI.Container();
  var links_container=new PIXI.Container();
  var generateTicker = new PIXI.ticker.Ticker();
  app.stage.addChild(links_container);
  app.stage.addChild(nodes_container);

  // Change canvas size when resize event emit.
  window.addEventListener("resize", function() {
    width = window.innerWidth;
    height = window.innerHeight;
    for(let i=0; i<NODE_NUM; i++){
      setNodePos(i);
    }
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  document.getElementById("refresh_btn").addEventListener("click", function() {
    NODE_NUM = document.getElementById("node_num").value;
    initGraph();
  });

  initGraph();

  function initGraph() {
    nodes = [];
    nodes_container.destroy();
    links_container.destroy();
    nodes_container=new PIXI.Container();
    links_container=new PIXI.Container();
    app.stage.addChild(links_container);
    app.stage.addChild(nodes_container);

    // Append Nodes
    for(let i=0; i<NODE_NUM; i++){
      var node = new PIXI.Graphics();
      var circleSize = 50/NODE_NUM > 3 ? 50/NODE_NUM : 3;
      node.beginFill(0x589BAA);
      node.lineStyle(10/NODE_NUM,0xffffff);
      node.drawCircle(0, 0, circleSize);
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

    // like cron
    generateTicker.destroy();
    generateTicker = new PIXI.ticker.Ticker();
    generateTicker.stop();
    generateTicker.add((delta) => {
      if( Math.floor( Math.random() * 100 ) < 10 ){
        var from = Math.floor( Math.random() * NODE_NUM )
        for(key in nodes[from].links){
          sendBlock(from, key);
        }
      }
    });
    generateTicker.start();
    document.getElementById("node_num").value = NODE_NUM;
  }

  function setNodePos(target){
    if(POSITION_TYPE==="random") {
      var x = Math.floor( Math.random() * (width*0.9 + 1 - width*0.1) ) + width*0.1;
      var y = Math.floor( Math.random() * (height*0.9 + 1 - height*0.2) ) + height*0.2;
    }
    else if(POSITION_TYPE==="circle") {
      var r = width<height ? width*0.4 : height*0.4;
      var x = width*0.5 + r * Math.sin(2*Math.PI/NODE_NUM*target)
      var y = height*0.55 + r * Math.cos(2*Math.PI/NODE_NUM*target)
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
    nodes[from].links[to].alpha = 0.3
    nodes[to].links[from] = nodes[from]
    links_container.addChild(nodes[from].links[to]);
  }

  function sendBlock(from, to){
    var block = new PIXI.Graphics();
    var circleSize = 20/NODE_NUM > 3 ? 20/NODE_NUM : 3;
    block.beginFill(0x38F150);
    block.drawCircle(0, 0, circleSize);
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