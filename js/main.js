import * as PIXI from 'pixi.js';
import {TweenMax} from "gsap/TweenMax";
var Graph = require('./graph');
var Chain = require('./chain');
var Network = require('./network');
var UI = require('./UI');

//global parameter
window.TRANSACTION_SIZE = 10; // KB
window.TRANSACTION_FREQ = 5; // tx/s
window.BLOCK_SIZE = 1; // MB
window.BLOCK_TIME = 1; // sec
window.NETWORK_SPEED = 19; // Mbps
window.NODE_NUM = 16;
window.LAYOUT_TYPE = "random";
window.GRAPH_VISIBLE = false;
window.RUNNING = true;

//result values
window.CONFIRMED_TX_NUM = 0;
window.ELAPSED_TIME = 0;
window.BLOCK_HEIGHT = 0;
window.THROUGHPUT = 0;
window.ATTACK_LISK = 0;
window.TX_LATENCY = 0;

window.onload = function () {
  var ui = new UI();
  ui.setInfo();
  var network = new Network(NODE_NUM);
  var chain = new Chain();
  chain.init()
  var graph = new Graph(network.nodes);

  // Increment elapsed time
  var elapsed_timer = setInterval(()=>{
    if(RUNNING) ELAPSED_TIME += 1;
  }, 1000)

  // Event listener for refresh button.
  document.getElementById("refresh_btn").addEventListener("click", ()=> { 
    ui.getInfo();
    network.init(NODE_NUM);
    graph.init(network.nodes);
    chain.init();
    ui.init();
    ui.closeModal();
  });
}