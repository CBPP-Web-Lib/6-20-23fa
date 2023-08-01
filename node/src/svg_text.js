import { sel, vx, vy } from "./globals"

function setup_svg_text(svg) {
  
  document.querySelector(sel).querySelectorAll(".s1, .s2, .s3").forEach((p) => {
    p.style.opacity = 0;
  })
  const labels = svg.append("g")
    .attr("class", "labels");

  labels.append("text")
    .attr("class", "fade-before-end")
    .text("Not currently working")
    .attr("x", vx(0.8))
    .attr("y", vy(0.55))
    .attr("opacity", 1)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .attr("font-size", "4")

  labels.append("text")
    .attr("class", "fade-before-end")
    .text("Currently working")
    .attr("x", vx(0.2))
    .attr("y", vy(0.55))
    .attr("opacity", 1)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .attr("font-size", "4");

  svg.selectAll(".fade-until-end")
    .attr("opacity", 0);
}

export {
  setup_svg_text
}