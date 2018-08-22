export default function angleOnCircle(cx, cy, px, py) {
  const ret = Math.atan2(py - cy, px - cx);
  if (ret < 0) { return 2 * Math.PI + ret; }
  return ret;
}
