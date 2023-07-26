const id = "fa6-20-23"
const sel = "#" + id

const viewWidth = 90
const viewMargin = 2
const viewHeight = 100 / 1.8 - viewMargin * 2

const vx = function(x) {
  return x * viewWidth;
}

const vy = function(y) {
  return y * viewWidth - (viewWidth - viewHeight) / 2 - 17;
}

const dot_size = 0.012

export {
  id, 
  sel, 
  viewWidth, 
  viewMargin,
  viewHeight,
  dot_size,
  vx,
  vy
}