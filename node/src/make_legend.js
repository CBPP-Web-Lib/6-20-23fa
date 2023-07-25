import { select } from "d3";

function make_legend(sel) {
    document.querySelector(sel).querySelectorAll(".legend-circle").forEach((el)=>{
        var color = el.getAttribute("data-color");
        var circle_svg = select(el).append("svg")
            .attr("viewBox", "0 0 10 10");
        circle_svg.append("circle")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("fill", color)
            .attr("r", 4)
    })
}

export { make_legend }