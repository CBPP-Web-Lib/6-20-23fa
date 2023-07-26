import { select as d3_select } from "d3"
import { sel, vx, vy } from "./globals"

function groupLabel(config) {
  var label = d3_select(sel + " .svg-container > svg > g.main-g").selectAll("g.aggregate-label")
    .data([config]);
  var y = 0.47;
  var right = 0.97;
  label.enter()
    .append("g")
    .attr("class", "aggregate-label")
    .each(function(d) {
      d3_select(this).append("rect")
        .attr("class", "bracket-bg")
        .attr("fill", "rgba(0, 0, 0, 0.05)")
        .attr("x", vx(d.left))
        .attr("y", vy(y))
        .attr("width", vx(right) - vx(d.left))
        .attr("height", vx(0.77) - vx(y));
      d3_select(this).append("line")
        .attr("class", "main")
        .attr("x1", vx(d.left))
        .attr("x2", vx(right))
        .attr("y1", vy(y))
        .attr("y2", vy(y))
        .attr("stroke-width", 0.2)
        .attr("stroke", "#000");
      d3_select(this).append("line")
        .attr("class", "right")
        .attr("x1", vx(right))
        .attr("x2", vx(right))
        .attr("y1", vy(y))
        .attr("y2", vy(y + 0.01))
        .attr("stroke-width", 0.2)
        .attr("stroke", "#000");
      d3_select(this).append("line")
        .attr("class", "left")
        .attr("x1", vx(d.left))
        .attr("x2", vx(d.left))
        .attr("y1", vy(y))
        .attr("y2", vy(y + 0.01))
        .attr("stroke-width", 0.2)
        .attr("stroke", "#000");
      d3_select(this).append("text")
        .text(d.text)
        .attr("text-anchor", "end")
        .attr("y", vy(y - 0.01))
        .attr("x", vx(right))
        .attr("font-size", 3)
        .attr("fill", "#000");
    })
    .merge(label)

  label.each(function(d) {
    d3_select(this).select("rect.bracket-bg")
      .transition()
      .duration(d.duration)
      .attr("x", vx(d.left))
      .attr("width", vx(right) - vx(d.left));
    d3_select(this).select("line.main")
      .transition()
      .duration(d.duration)
      .attr("x1", vx(d.left))
    d3_select(this).select("line.left")
      .transition()
      .duration(d.duration)
      .attr("x1", vx(d.left))
      .attr("x2", vx(d.left))
    d3_select(this).select("text")
      .attr("opacity", 1)
      .transition()
      .duration(d.duration / 2)
      .attr("opacity", 0)
      .on("end", () => {
        d3_select(this).select("text")
          .text(d.text)
          .transition()
          .duration(d.duration / 2)
          .attr("opacity", 1);
      });
  })
}

export { groupLabel }