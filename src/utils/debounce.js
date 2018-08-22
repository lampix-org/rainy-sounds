// Debouncing function. Can be used with any desired functionality that is called too often.
export default function debounce(fn, time) {
  let timeout;

  return function () {
    const functionCall = () => fn.apply(this, fn, time);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}
