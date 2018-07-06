import * as PIXI from 'pixi.js';
import {TweenMax} from "gsap/TweenMax";
var Graph = require('./js/graph');
var Node = require('./js/node');

window.onload = function () {
  var graph = new Graph;

  document.getElementById("refresh_btn").addEventListener("click", function() { 
    graph.init();
  });
}