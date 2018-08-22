// get a random number within a range
export default function randomInt(min, max) {
  return Math.random() * (max - min) + min;
}
