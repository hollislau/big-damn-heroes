const Router = module.exports = function () {
  this.routes = {
    GET: {
      "/": function (req, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write("You can't take the sky from me.");
        res.end();
      }
    },
    POST: {},
    PUT: {},
    PATCH: {},
    DELETE: {},
    badRoute: function (req, res) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("Gorramit! That ain't ruttin' here!");
      res.end();
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
    res.send = res.write;

    if (typeof routes[req.method][req.url] === "function") {
      return routes[req.method][req.url](req, res);
    }

    routes.badRoute(req, res);
  };
};
