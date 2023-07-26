
import { forceSimulation } from "d3-force"
import { aggregate_dot_model } from "./aggregate_dot_model"
import { data } from "./load_data"
import seedrandom from "seedrandom"
import {
  sel,
  vx,
  vy,
  dot_size
} from "./globals"
import { setup_svg_text } from "./svg_text"
import { select } from "d3"
import { force_to_center, boundary_force, collision_force } from "./forces"
import { groupLabel } from "./group_labels"

const d3 = { select }

function run_animation(svg) {

  var dot_model = initialize_dots(data)

  setup_svg_text(svg);

  var dot_layer = svg.append("g")
    .attr("class", "dots");
  dot_layer.append("g");
  dot_layer.selectAll("g.person")
    .data(dot_model)
    .enter()
    .append("g")
    .attr("class", "person")
    .each(function(d) {
      var effective_month = get_effective_month(d.months_since_work);
      d3.select(this).append("circle")
        .attr("cx", vx(d.x))
        .attr("cy", vy(d.y))
        .attr("r", vx(dot_size) - vx(0))
        .attr("fill", effective_month > 12 ? "#cccccc" : "#0c61a4")
        .attr("stroke-width", 0)
        .attr("fill-opacity", effective_month > 12 ? 1 : 1 - effective_month / 16)
    })

  const tick_update = function() {
    svg.selectAll("g.person")
      .each(function(d) {
        var effective_month = get_effective_month(d.months_since_work);
        d3.select(this).select("circle")
          .attr("cx", vx(d.x))
          .attr("cy", vy(d.y))
          .attr("fill", effective_month > 12 ? "#cccccc" : "#0c61a4")
          .attr("fill-opacity", effective_month > 12 ? 1 : 1 - effective_month / 16)
      })
  }

  var main_simulation;

  Promise.resolve().then(function() {

    /*run an initial force sim to get initial positions of dots without collisions*/
    return new Promise((resolve) => {
      main_simulation = forceSimulation(dot_model)
        .force("force_center", force_to_center(10, working_groups, dot_model).force)
        .force("boundary_force", boundary_force)
        .force("collide", collision_force)
        .alphaDecay(0)
        .alpha(0.01)
        .stop()
        .tick(2000);
      main_simulation.restart();
      main_simulation.on("tick", tick_update);
      document.querySelector(sel).querySelectorAll(".s1").forEach((p) => {
        p.style.opacity = 1;
        p.style["font-weight"] = "bold";
      })
      setTimeout(resolve, 10);
    })
  }).then(function() {
    return new Promise((resolve) => {
      svg.style("opacity", 1);
      var alpha = 0.0;
      var alpha_increase = setInterval(function() {
        alpha += 0.0001;
        if (alpha > 0.01) {
          clearInterval(alpha_increase);
          resolve();
        }
        main_simulation.alpha(alpha);
        main_simulation.restart();
      }, 10)
    });
  }).then(function() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    })
  }).then(function() {
    return new Promise((resolve) => {
      var month = 0;

      function move_people() {
        month += 0.025;
        month = Math.min(12, month);
        svg.select("circle.timeline-indicator")
          .attr("cx", vx(month / 12))
        svg.select("line.line-timeline")
          .attr("x2", vx(month / 12));
        dot_model.forEach((person) => {
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
      document.querySelector(sel).querySelectorAll(".s2").forEach((p) => {
        p.style.opacity = 1;
        p.style["font-weight"] = "bold";
      })
      document.querySelector(sel).querySelectorAll(".s1").forEach((p) => {
        p.style["font-weight"] = "normal";
      })
    })
  }).then(function() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    })
  }).then(function() {
    return new Promise((resolve) => {
      main_simulation.stop();
      document.querySelector(sel).querySelectorAll(".s3").forEach((p) => {
        p.style.opacity = 1;
        p.style["font-weight"] = "bold";
      })
      
      document.querySelector(sel).querySelectorAll(".s1, .s2").forEach((p) => {
        p.style["font-weight"] = "normal";
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
      Object.keys(x_loc).forEach((key) => {
        var text = "Didn't work";
        if (!isNaN(key * 1)) {
          text = "Worked in past " + key + " months";
        }
        if (key * 1 === 1) {
          text = "Worked in past month";
        }
        var x = vx(x_loc[key]);
        var y = vy(0.78);
        svg.append("text")
          .text(text)
          .attr("text-anchor", "end")
          .attr("transform-origin", [x, y].join(" "))
          .attr("transform", "rotate(-45)")
          .attr("font-size", 2.5)
          .attr("x", x)
          .attr("y", y)
        svg.append("text")
          .attr("text-anchor", "end")
          .attr("transform-origin", [x, y].join(" "))
          .attr("transform", "rotate(-45)")
          .attr("font-size", 3)
          .attr("x", x + 1)
          .attr("y", y + 2.5)
          .text(Math.round(aggregate_data[key].length) + "%")
      })
      setTimeout(resolve, 2100);
    })
  }).then(function() {
    return new Promise((resolve) => {
      groupLabel({
        text: "51% worked in the past month",
        left: 0.83,
        duration: 0
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve) => {
      groupLabel({
        text: "59% worked within the past three months",
        left: 0.68,
        duration: 500
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve) => {
      groupLabel({
        text: "63% worked within the past six months",
        left: 0.53,
        duration: 500
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve) => {
      groupLabel({
        text: "68% worked within the past nine months",
        left: 0.38,
        duration: 500
      })
      setTimeout(resolve, 3000);
    })
  }).then(function() {
    return new Promise((resolve) => {
      groupLabel({
        text: "74% worked within the past year.",
        left: 0.23,
        duration: 500
      })
      setTimeout(resolve, 9000);
    })
  }).then(function() {
    return new Promise((resolve) => {
      svg.style("opacity", 0);
      document.querySelector(sel).querySelectorAll(".s1, .s2, .s3").forEach((p) => {
        p.style.opacity = 0;
        p.style["font-weight"] = "normal";
      })
      setTimeout(resolve, 200);
    })
  }).then(function() {
    return new Promise((resolve) => {
      svg.html(null);
      svg.style("opacity", 1);
      setTimeout(resolve, 200);
    })
  }).then(function() {
    run_animation(svg);
  })

  
}

function get_effective_month(month) {
  var floors = [12, 9, 6, 3, 1];
  if (month === -1) {
    return 24;
  }
  var effective_month = floors[0];
  floors.forEach((floor) => {
    if (month < floor) {
      effective_month = floor;
    }
  })
  return effective_month;
}

const working_groups = function(p) {
  var center = [0.15, 0.7];
  if (p.working) {
    center = [0.85, 0.7];
  }
  return center;
}

function initialize_dots(data) {
  var dot_model = [];
  var rng = new seedrandom(3)
  data.forEach((row) => {
    var r = rng() * 0.5;
    var theta = rng() * 2 * Math.PI;
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);
    y += 0.6;
    x += (row[0] === 0 ? 0.15 : 0.85);
    var p = {
      x,
      y
    };
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
  return dot_model;
}

export { run_animation }