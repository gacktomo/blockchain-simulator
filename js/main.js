import * as PIXI from 'pixi.js';
import {TweenMax} from "gsap/TweenMax";
var Graph = require('./graph');
var Network = require('./network');
var UI = require('./UI');

//global settings
window.TRANSACTION_SIZE = 1; //KB
window.BLOCK_SIZE = 1; //MB
window.BLOCK_TIME = 10; //sec
window.NETWORK_SPEED = 19; //Mbps
window.NODE_NUM = 16;
window.LAYOUT_TYPE = "circle";

window.onload = function () {
  var ui = new UI();
  ui.setInfo();
  var network = new Network(NODE_NUM);
  var graph = new Graph(network.nodes);

  // Event listener for refresh button.
  document.getElementById("refresh_btn").addEventListener("click", ()=> { 
    ui.getInfo();
    network.init(NODE_NUM);
    graph.init(network.nodes);
    ui.closeModal();
  });
}