/*Load some required libraries*/
import "core-js/stable";
import "regenerator-runtime/runtime";

/*load stylesheet*/
import "./style.scss";

//const figure = require("cbpp_figure")($);
import { select, forceCollide } from "d3";
const d3 = { select, forceCollide }
import { forceSimulation } from "d3-force";
import forceBoundary from "d3-force-boundary";
import { load_typekit } from "./load_typekit";
import seedrandom from "seedrandom";
import { make_legend } from "./make_legend";

import { aggregate_dot_model } from "./aggregate_dot_model";

const id = "fa6-20-23"
const sel = "#" + id
var rng = new seedrandom(3)
var svg_el
var svg

document.querySelector(sel).style.opacity = 0

import { data } from "./load_data"

function run_animation() {
  rng = new seedrandom(3)
  document.querySelector(sel).querySelectorAll(".s1, .s2, .s3").forEach((p)=>{
    p.style.opacity = 0;
  })
  var dot_model = [];
  data.forEach((row)=>{
    var r = rng()*0.5;
    var theta = rng()*2*Math.PI;
    var x = r*Math.cos(theta);
    var y = r*Math.sin(theta);
    y += 0.6;
    x += (row[0] === 0 ? 0.15 : 0.85);
    var p = {x, y};
    p.worked = row[0];
    p.working = row[0];
    p.months_since_work = -1;
    if (p.working) {
      p.months_since_work = 0;
    }
    p.timeOffset = rng();
    //p.timeOffset = 0;
    p.data = row;
    dot_model.push(p);
  });

  var vx = function(x) {
    return x*viewWidth;
  }
  var vy = function(y) {
    return y*viewWidth - (viewWidth - viewHeight)/2 - 20;
  }

  const viewWidth = 90;
  const viewMargin = 2;
  const viewHeight = 100/1.7 - viewMargin*2;
  if (typeof(svg_el)==="undefined") {
    svg_el = d3.select(sel + " .svg-container").append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("viewBox",[
        0 - viewMargin,
        0 - viewMargin,
        viewWidth + viewMargin*2,
        viewHeight + viewMargin*2
      ].join(" "));
  }
  if (typeof(svg)==="undefined") {
    svg = svg_el.append("g")
      .attr("class","main-g")
      .style("opacity", 0);
  }
  const labels = svg.append("g")
    .attr("class","labels");

  var not_working_label = labels.append("text")
    .attr("class","fade-before-end")
    .text("Not working")
    .attr("x", vx(0.2))
    .attr("y", vy(0.5))
    .attr("opacity", 1)
    .attr("text-anchor","middle")
    .attr("fill", "#000")
    .attr("font-size", "4")

  var working_label = labels.append("text")
    .attr("class","fade-before-end")
    .text("Working")
    .attr("x", vx(0.8))
    .attr("y", vy(0.5))
    .attr("opacity", 1)
    .attr("text-anchor","middle")
    .attr("fill", "#000")
    .attr("font-size", "4");
  var timeline = svg.append("g")
    .attr("class","timeline")
    .style("opacity", 1);
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec", "Jan"];
  months.forEach((month, i)=> {
    timeline.append("text")
      .attr("class","month-label")
      .attr("text-anchor","middle")
      .attr("x", vx(i/12))
      .attr("y", vy(0.42))
      .attr("fill","#000")
      .attr("font-size","2")
      .text(month);
  })
  timeline.append("line")
    .attr("stroke-width",0.15)
    .attr("class","line-timeline")
    .attr("x1", vx(0))
    .attr("x2", vx(0))
    .attr("y1", vy(0.44))
    .attr("y2", vy(0.44))
    .attr("stroke", "#000");
  timeline.append("circle")
    .attr("fill", "#fff")
    .attr("stroke","#000")
    .attr("stroke-width", "0.3")
    .attr("class","timeline-indicator")
    .attr("cx", vx(0))
    .attr("cy", vy(0.44))
    .attr("r", 0.5);

  svg.selectAll(".fade-until-end")
    .attr("opacity", 0);

  var dot_size = 0.012;

  const force_to_center = function(strength, center_assign) {
    var ForceToCenter = function() {
      this.force = function(alpha) {
        dot_model.forEach((p)=>{
          var center = center_assign(p);
          var x_off = p.x - center[0];
          var y_off = p.y - center[1];
          var dist_squared = Math.pow(x_off, 2) + Math.pow(y_off, 2);
          var k = alpha*strength;
          p.vx += (-x_off * k * dist_squared);
          p.vy += (-y_off * k * dist_squared);
        })
      }
      this.strength = function(_strength) {
        strength = _strength;
      }
    }
    return new ForceToCenter();
  }

  const boundary_force = forceBoundary(-1, 0.53, 2, 0.7)
    .strength(0.05);
  
  const boundary_force_end = forceBoundary(-1, 0.49, 2, 0.7)
    .strength(0.05);

  const working_groups = function(p) {
    var center = [0.15,0.6];
    if (p.working) {
      center = [0.85,0.6];
    }
    return center;
  }

  const final_center = force_to_center(5, function(p) {
    var center = [0.1,0.55];
    if (p.worked) {
      center = [0.87,0.6];
    }
    return center;
  })

  var dot_layer = svg.append("g")
    .attr("class","dots");
  dot_layer.append("g");
  dot_layer.selectAll("g.person")
    .data(dot_model)
    .enter()
    .append("g")
    .attr("class","person")
    .each(function(d) {
      var effective_month = get_effective_month(d.months_since_work);
      d3.select(this).append("circle")
        .attr("cx", vx(d.x))
        .attr("cy", vy(d.y))
        .attr("r", vx(dot_size)-vx(0))
        .attr("fill",effective_month > 12 ? "#cccccc" : "#0c61a4")
        .attr("stroke-width", 0)
        .attr("fill-opacity", effective_month > 12 ? 1 : 1 - effective_month/16)
    })

  const tick_update = function() {
    svg.selectAll("g.person")
    .each(function(d) {
      var effective_month = get_effective_month(d.months_since_work);
      d3.select(this).select("circle")
        .attr("cx", vx(d.x))
        .attr("cy", vy(d.y))
        .attr("fill",effective_month > 12 ? "#cccccc" : "#0c61a4")
        .attr("fill-opacity", effective_month > 12 ? 1 : 1 - effective_month/16)
      })
  }

  var main_simulation;

  Promise.resolve().then(function() {
    return new Promise((resolve)=>{ 
      main_simulation = forceSimulation(dot_model)
        .force("force_center", force_to_center(10, working_groups).force)
        .force("boundary_force", boundary_force)
        .force("collide", d3.forceCollide(dot_size*1.4))
        .alphaDecay(0)
        .alpha(0.01)
        .stop()
        .tick(2000);
      main_simulation.restart();
      main_simulation.on("tick", tick_update);
      resolve();
    })
  }).then(function() {
    return new Promise((resolve)=> {
      setTimeout(resolve, 10);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      svg.style("opacity", 1);
      resolve();
    })
  }).then(function() {
    return new Promise((resolve)=>{
      var alpha = 0.0;
      var alpha_increase = setInterval(function() {
        alpha += 0.0001;
        if (alpha > 0.01) {
          clearInterval(alpha_increase);
          //s1.style("opacity", 1);
          document.querySelector(sel).querySelectorAll(".s1").forEach((p)=>{
            p.style.opacity = 1;
          })
          svg.selectAll("g.person circle").attr("fill-opacity", 1);
         // working_label.attr("opacity", 1);
          //not_working_label.attr("opacity", 1);
          resolve();
        }
        main_simulation.alpha(alpha);
        main_simulation.restart();
      }, 10)
    });
  }).then(function() {
    return new Promise((resolve)=>{
      setTimeout(resolve, 2000);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      var month = 0;
      function move_people() {
        month+=0.025;
        month = Math.min(12, month);
        svg.select("circle.timeline-indicator")
          .attr("cx", vx(month/12))
        svg.select("line.line-timeline")
          .attr("x2", vx(month/12));
        dot_model.forEach((person)=>{
          var person_month = Math.min(11, Math.floor(month + person.timeOffset));
          person.working = person.data[person_month];
          if (person.working) {
            person.months_since_work = 0;
          } else {
            if (person.months_since_work >= 0) {
              person.months_since_work += 0.025;
            }
          }
          person.worked = person.worked || person.working;
        });
        if (month >= 12) {
          clearInterval(month_timer);
          resolve();
        }
      }
      var month_timer = setInterval(move_people, 20);
      //s2.style("opacity", 1);
      document.querySelector(sel).querySelectorAll(".s2").forEach((p)=>{
        p.style.opacity = 1;
      })
     //legend.attr("opacity", 1);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      setTimeout(resolve, 2000);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      main_simulation.stop();
      document.querySelector(sel).querySelectorAll(".s3").forEach((p)=>{
        p.style.opacity = 1;
      })
      svg.selectAll(".fade-until-end")
        .attr("opacity", 1);
      svg.selectAll(".fade-before-end")
        .attr("opacity", 0);
      var { aggregate_data, x_loc } = aggregate_dot_model(dot_model);
      svg.selectAll("g.person").each(function(d) {
        var circle = d3.select(this).select("circle");
        circle.transition()
          .duration(1000)
          .attr("cx", vx(d.x_targ))
          .attr("cy", vy(d.y_targ));
      })
      svg.select("g.timeline").style("opacity", 0);
      Object.keys(x_loc).forEach((key)=>{
        var text = "Didn't work";
        if (!isNaN(key*1)) {
          text = "Worked in past " + key + " months";
        }
        if (key*1===1) {
          text = "Worked in past month";
        }
        var x = vx(x_loc[key]);
        var y = vy(0.78);
        svg.append("text")
          .text(text)
          .attr("text-anchor","end")
          .attr("transform-origin", [x, y].join(" "))
          .attr("transform","rotate(-45)")
          .attr("font-size",2.5)
          .attr("x", x)
          .attr("y", y)
        svg.append("text")
          .attr("text-anchor","end")
          .attr("transform-origin", [x, y].join(" "))
          .attr("transform","rotate(-45)")
          .attr("font-size", 3)
          .attr("x", x + 1)
          .attr("y", y + 2.5)
          .text(Math.round(aggregate_data[key].length) + "%")
      })
      setTimeout(resolve, 2100);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      groupLabel({
        text: "51% worked in the past month",
        left: 0.83,
        duration: 0
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      groupLabel({
        text: "59% worked within the past three months",
        left: 0.68,
        duration: 500
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      groupLabel({
        text: "63% worked within the past six months",
        left: 0.53,
        duration: 500
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      groupLabel({
        text: "68% worked within the past nine months",
        left: 0.38,
        duration: 500
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      groupLabel({
        text: "74% worked within the past year.",
        left: 0.23,
        duration: 500
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      svg.style("opacity", 0);
      document.querySelector(sel).querySelectorAll(".s1, .s2, .s3").forEach((p)=>{
        p.style.opacity = 0;
      })
      setTimeout(resolve, 200);
    })
  }).then(function() {
    return new Promise((resolve)=>{
      svg.html(null);
      svg.style("opacity", 1);
      setTimeout(resolve, 200);
    })
  }).then(function() {
    run_animation();
  })

  
  function groupLabel(config) {
    var label = d3.select(sel + " .svg-container > svg > g.main-g").selectAll("g.aggregate-label")
      .data([config]);
    var y = 0.47;
    var right = 0.97;
    label.enter()
      .append("g")
      .attr("class","aggregate-label")
      .each(function(d) {
        d3.select(this).append("rect")
          .attr("class","bracket-bg")
          .attr("fill", "rgba(0, 0, 0, 0.05)")
          .attr("x", vx(d.left))
          .attr("y", vy(y))
          .attr("width", vx(right) - vx(d.left))
          .attr("height", vx(0.77) - vx(y));
        d3.select(this).append("line")
          .attr("class","main")
          .attr("x1", vx(d.left))
          .attr("x2", vx(right))
          .attr("y1", vy(y))
          .attr("y2", vy(y))
          .attr("stroke-width", 0.2)
          .attr("stroke","#000");
        d3.select(this).append("line")
          .attr("class","right")
          .attr("x1", vx(right))
          .attr("x2", vx(right))
          .attr("y1", vy(y))
          .attr("y2", vy(y + 0.01))
          .attr("stroke-width", 0.2)
          .attr("stroke","#000");
        d3.select(this).append("line")
          .attr("class","left")
          .attr("x1", vx(d.left))
          .attr("x2", vx(d.left))
          .attr("y1", vy(y))
          .attr("y2", vy(y + 0.01))
          .attr("stroke-width", 0.2)
          .attr("stroke","#000");
        d3.select(this).append("text")
          .text(d.text)
          .attr("text-anchor","end")
          .attr("y", vy(y - 0.01))
          .attr("x", vx(right))
          .attr("font-size", 3)
          .attr("fill","#000");
      })
      .merge(label)

    label.each(function(d) {
      d3.select(this).select("rect.bracket-bg")
        .transition()
        .duration(d.duration)
        .attr("x", vx(d.left))
        .attr("width", vx(right) - vx(d.left));
      d3.select(this).select("line.main")
        .transition()
        .duration(d.duration)
        .attr("x1", vx(d.left))
      d3.select(this).select("line.left")
        .transition()
        .duration(d.duration)
        .attr("x1", vx(d.left))
        .attr("x2", vx(d.left))
      d3.select(this).select("text")
        .attr("opacity", 1)
        .transition()
        .duration(d.duration/2)
        .attr("opacity", 0)
        .on("end", () => {
          d3.select(this).select("text")
            .text(d.text)
            .transition()
            .duration(d.duration/2)
            .attr("opacity", 1);
        });
    })
  }
}

Promise.all([
  new Promise((resolve)=>{
    load_typekit(resolve)
  })
]).then(() =>{
  
  document.querySelector(sel).style.opacity = 1
  document.querySelector(sel).style.visibility = "visible"
  make_legend(sel)
  run_animation();
  

})



function get_effective_month(month) {
  var floors = [12, 9, 6, 3, 1];
  if (month === -1) {
    return 24;
  }
  var effective_month = floors[0];
  floors.forEach((floor)=>{
    if (month < floor) {
      effective_month = floor;
    }
  })
  return effective_month;
}