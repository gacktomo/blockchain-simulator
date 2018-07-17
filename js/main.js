import * as PIXI from 'pixi.js';
import {TweenMax} from "gsap/TweenMax";
var Graph = require('./graph');
var Chain = require('./chain');
var Network = require('./network');
var UI = require('./UI');

//global parameter
window.TRANSACTION_SIZE = 100; // KB
window.TRANSACTION_FREQ = 10; // tx/s
window.BLOCK_SIZE = 1; // MB
window.BLOCK_TIME = 1; // sec
window.NETWORK_SPEED = 19; // Mbps
window.NODE_NUM = 16;
window.GROUP_NUM = 2;
window.LAYOUT_TYPE = "random";
window.GRAPH_VISIBLE = true;
window.RUNNING = true;
window.RESET_NUM = 0;

//result values
window.CONFIRMED_TX_NUM = 0;
window.ELAPSED_TIME = 0;
window.BLOCK_HEIGHT = 0;
window.THROUGHPUT = 0;
window.ATTACK_LISK = 0;
window.TX_LATENCY = 0;

window.onload = function () {
  var ui = new UI();
  ui.init();
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
    RESET_NUM++;
    RUNNING = false
    ui.getInfo();
    ui.init();
    network.init(NODE_NUM);
    chain.init();
    ui.closeModal();
    graph.init(network.nodes);
    RUNNING = true
  });
}