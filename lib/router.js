var send = require(__dirname + "/send");

const Router = module.exports = function () {
  this.routes = {
    GET: {
      "/": function (req, res) {
        res.send("We've done the impossible, and that makes us mighty.");
      }
    },
    POST: {},
    PUT: {},
    PATCH: {},
    DELETE: {},
    badRoute: function (req, res) {
      res.send("Gorramit! That ain't ruttin' here! (404: Not Found)");
    }
  };
};

Router.prototype.get = function (routeName, cb) {
  this.routes.GET[routeName] = cb;
  return this;
};

Router.prototype.post = function (routeName, cb) {
  this.routes.POST[routeName] = cb;
  return this;
};

Router.prototype.put = function (routeName, cb) {
  this.routes.PUT[routeName] = cb;
  return this;
};

Router.prototype.patch = function (routeName, cb) {
  this.routes.PATCH[routeName] = cb;
  return this;
};

Router.prototype.delete = function (routeName, cb) {
  this.routes.DELETE[routeName] = cb;
  return this;
};

Router.prototype.badRoute = function (cb) {
  this.routes.badRoute = cb;
  return this;
};

Router.prototype.route = function () {
  var routes = this.routes;

  return function (req, res) {
    res.send = send;

    if (typeof routes[req.method][req.url] === "function") {
      res.statusCode = 200;
      return routes[req.method][req.url](req, res);
    }

    res.statusCode = 404;
    routes.badRoute(req, res);
  };
};
