const http = require("http");
const Router = require(__dirname + "/router");

module.exports = (function () {
  var router = new Router();

  function get(path, cb) {
    router.get(path, cb);
  }

  function listen(port, cb) {
    http.createServer(router.route()).listen(port, cb);
  }

  return {
    get: get,
    listen: listen
  };
})();
