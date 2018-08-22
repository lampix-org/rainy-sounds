export default function randomAngleDeg(min, max) {
  return Math.randomIntMinMax(min, max) * (Math.PI / 180);
}

Math.randomIntMinMax = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
