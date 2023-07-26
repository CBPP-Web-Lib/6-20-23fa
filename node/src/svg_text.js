import { sel, vx, vy } from "./globals"

function setup_svg_text(svg) {
  
  document.querySelector(sel).querySelectorAll(".s1, .s2, .s3").forEach((p) => {
    p.style.opacity = 0;
  })
  const labels = svg.append("g")
    .attr("class", "labels");

  labels.append("text")
    .attr("class", "fade-before-end")
    .text("Not working")
    .attr("x", vx(0.2))
    .attr("y", vy(0.55))
    .attr("opacity", 1)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .attr("font-size", "4")

  labels.append("text")
    .attr("class", "fade-before-end")
    .text("Working")
    .attr("x", vx(0.8))
    .attr("y", vy(0.55))
    .attr("opacity", 1)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .attr("font-size", "4");

  var timeline = svg.append("g")
    .attr("class", "timeline")
    .style("opacity", 1);

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  
  months.forEach((month, i) => {
    timeline.append("text")
      .attr("class", "month-label")
      .attr("text-anchor", "middle")
      .attr("x", vx(i / 12))
      .attr("y", vy(0.42))
      .attr("fill", "#000")
      .attr("font-size", "2")
      .text(month);
  })
  
  timeline.append("line")
    .attr("stroke-width", 0.15)
    .attr("class", "line-timeline")
    .attr("x1", vx(0))
    .attr("x2", vx(0))
    .attr("y1", vy(0.44))
    .attr("y2", vy(0.44))
    .attr("stroke", "#000");
  
    timeline.append("circle")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", "0.3")
    .attr("class", "timeline-indicator")
    .attr("cx", vx(0))
    .attr("cy", vy(0.44))
    .attr("r", 0.5);

  svg.selectAll(".fade-until-end")
    .attr("opacity", 0);
}

export {
  setup_svg_text
}