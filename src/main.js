import * as PIXI from 'pixi.js';
import {TweenMax} from "gsap/TweenMax";
var Graph = require('./js/graph');
var Network = require('./js/network');
var UI = require('./js/UI');

window.onload = function () {
  var ui = new UI();
  var network = new Network(15);
  var graph = new Graph(network.nodes);

  // Event listener for refresh button.
  document.getElementById("refresh_btn").addEventListener("click", ()=> { 
    var num = document.getElementById("node_num").value;
    network.init(num);
    graph.init(network.nodes);
    ui.closeModal();
  });
}