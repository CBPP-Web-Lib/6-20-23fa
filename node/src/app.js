/*Load some required libraries*/
require("core-js/stable");
require("regenerator-runtime/runtime");
require("./style.scss");

var $ = require("jquery");
const figure = require("cbpp_figure")($);
import * as d3 from "d3";
import {forceSimulation} from "d3-force";
import forceBoundary from "d3-force-boundary";
console.log(forceSimulation);

const id = "fa6-20-23";
const sel = "#" + id;
const script_id = "script_" + id;
const script_sel = "#" + script_id;
const script_url = document.getElementById(script_id).src.split("?")[0];
const url_base = script_url.replace(/js\/app[\.min]*\.js/g,"");

const data = parse_data_string(require("raw-loader!./data.txt").default);

function parse_data_string(str) {
  str = str.split("\n");
  const r = [];
  str.forEach((line)=>{
    var l = line.split("");
    l.forEach((char, j)=>{
      l[j]*=1;
    })
    r.push(l);
  })
  return r;
}

Promise.all([
  new Promise((resolve)=>{
    figure.whenReady = resolve;
  }),
  new Promise((resolve)=>{
    $(resolve)
  })
]).then(() =>{

  var dot_model = [];
  data.forEach((row)=>{
    var r = Math.random()*0.1;
    var theta = Math.random()*2*Math.PI;
    var x = r*Math.cos(theta);
    var y = r*Math.sin(theta);
    y += 0.6;
    x += (row[0] === 0 ? 0.2 : 0.8);
    var p = {x, y};
    p.worked = row[0];
    p.working = row[0];
    p.timeOffset = Math.random();
    p.data = row;
    dot_model.push(p);
  });

  var vx = function(x) {
    return x*viewWidth;
  }
  var vy = function(y) {
    return y*viewWidth - (viewWidth - viewHeight)/2;
  }

  const container = $(sel);
  const viewWidth = 90;
  const viewHeight = 100/1.91 - 10;
  const viewMargin = 5;
  const svg = d3.select(sel).append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("viewBox",[
      0 - viewMargin,
      0 - viewMargin,
      viewWidth + viewMargin*2,
      viewHeight + viewMargin*2
    ].join(" "));

  const labels = svg.append("g")
    .attr("class","labels");

  var html_container = labels.append("foreignObject")
    .attr("x", vx(0))
    .attr("y", vy(0.35))
    .attr("width", viewWidth)
    .attr("height", 40);
  var s1 = html_container
    .append("xhtml:p")
    .attr("xmlns", "http://www.w3.org/1999/xhtml")
    .text("At any given time, about half of adults subject to the SNAP time limit are working.")
    .style("opacity", 1);
  var s2 = html_container.append("xhtml:p")
    .attr("xmlns", "http://www.w3.org/1999/xhtml")
    .text("But many SNAP participants move in and out of work frequently.")
    .style("opacity", 0);
  var s3 = html_container.append("xhtml:p")
    .attr("xmlns", "http://www.w3.org/1999/xhtml")
    .text("Most will have worked at some point during the previous year.")
    .style("opacity", 0)
    .style("margin-top","1em");

  labels.append("text")
    .attr("class","fade-before-end")
    .text("Not working")
    .attr("x", vx(0.2))
    .attr("y", vy(0.5))
    .attr("text-anchor","middle")
    .attr("fill", "#fff")
    .attr("font-size", "4")

  labels.append("text")
    .attr("class","fade-before-end")
    .text("Working")
    .attr("x", vx(0.8))
    .attr("y", vy(0.5))
    .attr("text-anchor","middle")
    .attr("fill", "#fff")
    .attr("font-size", "4");

  labels.append("text")
    .text("Most Working-Age SNAP Participants Work")
    .attr("x", vx(0))
    .attr("y", vy(0.27))
    .attr("text-anchor","start")
    .attr("fill","#FFCE6D")
    .attr("font-size",5)
    .attr("font-weight","bold");
  
  labels.append("text")
    .text("But Instability Overstates Joblessness")
    .attr("x", vx(0))
    .attr("y", vy(0.32))
    .attr("text-anchor","start")
    .attr("fill","#FFCE6D")
    .attr("font-size",4)
    .attr("font-weight","bold");

  labels.append("text")
    .attr("class","fade-until-end")
    .text("Never worked")
    .attr("x", vx(0.2))
    .attr("y", vy(0.71))
    .attr("text-anchor","middle")
    .attr("fill", "#fff")
    .attr("font-size", "4")

  labels.append("text")
    .attr("class","fade-until-end")
    .text("Worked at some point")
    .attr("x", vx(0.8))
    .attr("y", vy(0.75))
    .attr("text-anchor","middle")
    .attr("fill", "#fff")
    .attr("font-size", "4");

  var legend = svg.append("g")
    .attr("class","legend")
    .attr("opacity", 0);

  legend.append("text")
    .attr("class","legend")
    .text("Has not worked")
    .attr("fill", "#fff")
    .attr("font-size", "2")
    .attr("x", vx(0))
    .attr("y", 16);

  legend.append("text")
    .attr("class","legend")
    .text("Worked at some point")
    .attr("fill", "#fff")
    .attr("font-size", "2")
    .attr("x", vx(0.3))
    .attr("y", 16);

  legend.append("circle")
    .attr("fill", "rgba(255, 255, 255, 0.3)")
    .attr("r", 1)
    .attr("cx", 13)
    .attr("cy", 15.3);

  legend.append("circle")
    .attr("fill", "rgba(200, 200, 200, 1)")
    .attr("r", 1)
    .attr("cx", 44.5)
    .attr("cy", 15.3);


  svg.selectAll(".fade-until-end")
    .attr("opacity", 0);

  var dot_size = 0.012;

  const force_to_center = function(strength, center_assign) {
    return function(alpha) {
      dot_model.forEach((p)=>{
        var center = center_assign(p);
        var x_off = p.x - center[0];
        var y_off = p.y - center[1];
        var dist_squared = Math.pow(x_off, 2) + Math.pow(y_off, 2);
        var k = alpha*strength;
        p.vx = -x_off * k * 2*Math.min(dist_squared, 0.05);
        p.vy = -y_off * k * 2*Math.min(dist_squared, 0.05);
      })
    }
  }

  const boundary_force = forceBoundary(-1, 0.53, 2, 0.7)
    .strength(0.05)

  const working_groups = function(p) {
    var center = [0.2,0.6];
    if (p.working) {
      center = [0.8,0.6];
    }
    return center;
  }

  const initial_simulation = forceSimulation(dot_model)
    .force("force_center", force_to_center(0.1, working_groups))
   // .force("boundary_force", boundary_force)
    .force("collide", d3.forceCollide(dot_size*1.4))
    .stop()
    .alphaDecay(0)
    .tick(200);
  

  var dot_layer = svg.append("g")
    .attr("class","dots");
  dot_layer.append("g");
  dot_layer.selectAll("g.person")
    .data(dot_model)
    .enter()
    .append("g")
    .attr("class","person")
    .each(function(d) {
      d3.select(this).append("circle")
        .attr("cx", vx(d.x))
        .attr("cy", vy(d.y))
        .attr("r", vx(dot_size)-vx(0))
        .attr("fill","#0c61a4")
        .attr("stroke-width", 0)
        .attr("fill", d.worked ? "rgba(200, 200, 200, 1)" : "rgba(255, 255, 255, 0.3)")
    })

  const tick_update = function() {
    svg.selectAll("g.person")
    .each(function(d) {
      d3.select(this).select("circle")
        .attr("cx", vx(d.x))
        .attr("cy", vy(d.y))
        .attr("fill", d.worked ? "rgba(200, 200, 200, 1)" : "rgba(255, 255, 255, 0.3)")
      })
  }

  /*initial_simulation
    .on("tick", tick_update);
  
  return;*/
  const main_simulation = forceSimulation(dot_model)
    .force("force_center", force_to_center(10, working_groups))
    .force("boundary_force", boundary_force)
    .force("collide", d3.forceCollide(dot_size*1.4))
    .alpha(0.05)
    .alphaDecay(0);

  main_simulation.on("tick", tick_update);

  
  var month = 0;
  function move_people() {
    month+=0.02;
    dot_model.forEach((person)=>{
      var person_month = Math.floor(month - person.timeOffset) + 1;
      person.working = person.data[person_month];
      person.worked = person.worked || person.working;
    });
    if (month >= 12) {
      clearInterval(month_timer);
      setTimeout(function() {
        main_simulation.stop();
        svg.selectAll(".fade-until-end")
          .attr("opacity", 1);
        svg.selectAll(".fade-before-end")
          .attr("opacity", 0);
        final_simulation.restart();
        s3.style("opacity", 1);
      }, 2000);
    }
  }
  
  var month_timer;
  setTimeout(function() {
    month_timer = setInterval(move_people, 20);
    s2.style("opacity", 1);
    legend.attr("opacity", 1);
  }, 2000);

  var final_center = force_to_center(10, function(p) {
    var center = [0.2,0.55];
    if (p.worked) {
      center = [0.8,0.6];
    }
    return center;
  })

  var final_simulation = forceSimulation(dot_model)
    .force("to_group", final_center)
    .force("collide", d3.forceCollide(dot_size*1.3))
    .force("boundary_force", boundary_force)
    .alpha(0.03)
    .alphaDecay(0)
    .stop();

  final_simulation.on("tick", tick_update);


})