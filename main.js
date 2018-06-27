window.onload = function () {
  var width = 800;
  var height = 800;
  var nodes = [
    { id: 0, label: "nodeA" },
    { id: 1, label: "nodeB" },
    { id: 2, label: "nodeC" },
    { id: 3, label: "nodeD" },
    { id: 4, label: "nodeE" },
    { id: 5, label: "nodeF" },
  ];

  var links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 3 },
    { source: 2, target: 1 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 3 }
  ];
  var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .distance(140) // node同士の距離
    .friction(0.9) // 摩擦力(加速度)的なものらしい。
    .charge(-100) // 寄っていこうとする力。推進力(反発力)というらしい。
    .gravity(0.1) // 画面の中央に引っ張る力。引力。
    .start();

  var svg = d3.select("body")
    .append("svg")
    .attr({ width: width, height: height });

  var link = svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .style({
      stroke: "#ccc",
      "stroke-width": 1
    });

  var node = svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr({
      r: function () { return Math.random() * (40 - 10) + 10; }
    })
    .style({
      fill: "orange"
    })
    .call(force.drag);

  var label = svg.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr({
      "text-anchor": "middle",
      "fill": "white",
      "font-size": "9px"
    })
    .text(function (data) { return data.label; });

  force.on("tick", function () {
    link.attr({
      x1: function (data) { return data.source.x; },
      y1: function (data) { return data.source.y; },
      x2: function (data) { return data.target.x; },
      y2: function (data) { return data.target.y; }
    });
    node.attr({
      cx: function (data) { return data.x; },
      cy: function (data) { return data.y; }
    });
    label.attr({
      x: function (data) { return data.x; },
      y: function (data) { return data.y; }
    });
  });
}