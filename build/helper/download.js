define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = download;

  function download(file_name, content) {
    const anchor = document.createElement("a");
    const user_info = prompt();
    anchor.download = new Date().toISOString().replace(/:/g, "-") + "~" + user_info + "~" + file_name;
    anchor.href = "data:text/plain;charset=utf-8;base64," + btoa(content);
    anchor.click();
  }

  ;
});