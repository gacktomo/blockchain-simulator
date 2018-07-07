import * as PIXI from 'pixi.js';
import {TweenMax} from "gsap/TweenMax";

var Graph = require('./js/graph');
var Network = require('./js/network');

window.onload = function () {
  var network = new Network(6)
  var graph = new Graph(network.nodes);

  // Event when tapped refresh button.
  document.getElementById("refresh_btn").addEventListener("click", function() { 
    var num = document.getElementById("node_num").value;
    network.init(num);
    graph.init(network.nodes);
  });
}