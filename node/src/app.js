/*Load some required libraries*/
import "core-js/stable";
import "regenerator-runtime/runtime";

/*load stylesheet*/
import "./style.scss";


import { load_typekit } from "./load_typekit"
import { make_legend } from "./make_legend"
import { id, sel } from "./globals"
import { setup_svg } from "./setup_svg"
import { wait_for_scroll } from "./wait_for_scroll"

document.querySelector(sel).style.opacity = 0

Promise.all([
  new Promise((resolve)=>{
    load_typekit(resolve)
  })
]).then(() =>{
  document.querySelector(sel).style.opacity = 1
  document.querySelector(sel).style.visibility = "visible"
  var { svg } = setup_svg()
  make_legend(sel)
  wait_for_scroll(svg)
})