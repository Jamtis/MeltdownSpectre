const log = document.querySelector("#log");
const _console = {
  log(...args) {
    log.insertAdjacentHTML("afterbegin", args.join(" ") + "<br>");
  },

  error(...args) {
    log.insertAdjacentHTML("afterbegin", "error: " + args.join(" ") + "<br>");
  }

};
export default _console;