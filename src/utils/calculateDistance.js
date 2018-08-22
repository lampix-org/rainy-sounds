// calculate the distance between two points
export default function calculateDistance(p1x, p1y, p2x, p2y) {
  const xDistance = p1x - p2x;
  const yDistance = p1y - p2y;
  return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
}
