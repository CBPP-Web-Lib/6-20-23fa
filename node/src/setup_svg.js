import {
  sel,
  viewWidth, 
  viewMargin,
  viewHeight
} from "./globals"

import { select as d3_select } from "d3"

function setup_svg() {
  document.querySelector(sel + " .svg-container").innerHTML = "";
  var svg_el = d3_select(sel + " .svg-container").append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("viewBox", [
    0 - viewMargin,
    0 - viewMargin,
    viewWidth + viewMargin * 2,
    viewHeight + viewMargin * 2
    ].join(" "));
  var svg = svg_el.append("g")
    .attr("class", "main-g")
    .style("opacity", 0);
  return { svg_el, svg }
}

export { setup_svg }