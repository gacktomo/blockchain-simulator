import * as PIXI from 'pixi.js';
import {TweenMax} from "gsap/TweenMax";
var Graph = require('./js/graph');

window.onload = function () {

  // Change canvas size when resize event emit.
  // window.addEventListener("resize", function() {
  //   width = window.innerWidth;
  //   height = window.innerHeight;
  //   for(let i=0; i<NODE_NUM; i++){
  //     setNodePos(i);
  //   }
  //   app.renderer.resize(window.innerWidth, window.innerHeight);
  // });

  var graph = new Graph;

  document.getElementById("refresh_btn")
  .addEventListener("click", function() { 
    graph = null;
    graph = new Graph; 
  });

}