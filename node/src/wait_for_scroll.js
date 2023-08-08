import { id } from "./globals"
import { run_animation } from "./run_animation"

function wait_for_scroll(svg) {
  window.addEventListener("scroll", ()=>{
    check_if_visible(svg)
  })
  check_if_visible(svg)
}

var animation_starter = (() => {
  var animation_started = false
  return {
    start: function(svg) {
      if (!animation_started) {
        run_animation(svg)
      }
      animation_started = true
    }
  }
})()

function check_if_visible(svg) {
  var offset = document.getElementById(id)
    .querySelector(".svg-container")
    .getBoundingClientRect()
  var viewport_height = window.innerHeight
  if (offset.top < viewport_height - 50) {
    animation_starter.start(svg)
  }
}

export { wait_for_scroll }