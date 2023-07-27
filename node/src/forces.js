
import forceBoundary from "d3-force-boundary"
import { forceCollide } from "d3-force"
import { dot_size } from "./globals"

const force_to_center = function(strength, center_assign, dot_model) {
  var ForceToCenter = function() {
    this.force = function(alpha) {
      dot_model.forEach((p) => {
        var center = center_assign(p);
        var x_off = p.x - center[0];
        var y_off = p.y - center[1];
        var dist_squared = Math.pow(x_off, 2) + Math.pow(y_off, 2);
        var k = alpha * strength;
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

const boundary_force = forceBoundary(-1, 0.6, 2, 0.9)
  .strength(0.05);

const collision_force = forceCollide(dot_size * 1.4)

export { force_to_center, boundary_force, collision_force }