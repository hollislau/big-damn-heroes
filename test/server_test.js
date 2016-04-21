const fs = require("fs");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const bdh = require(__dirname + "/../lib/big-damn-heroes");

var port = 1234;

describe("server started without callback", () => {
  var noCbServer;

  before((done) => {
    try {
      fs.mkdirSync(__dirname + "/data");
    } catch (err) {
      if (err === "EEXIST") return;
    }

    bdh.post("/serenity", (req, res) => {
      var file = fs.createWriteStream(__dirname + "/data/river.json");

      req.pipe(file);
      req.on("end", () => {
        fs.readFile(__dirname + "/data/river.json", "utf8", (err, data) => {
          if (err) return process.stderr.write(err + "\n");
          res.send(data);
        });
      });
    });

    bdh.put("/mal", (req, res) => {
      res.send({ "Mal": "I aim to misbehave." });
    });

    bdh.patch("/jayne", (req, res) => {
      res.send(["I'll", "be", "in", "my", "bunk."]);
    });

    bdh.delete("/kaylee", (req, res) => {
      res.send(new Buffer("To hell with this, I'm gonna live!"));
    });

    noCbServer = bdh.listen(port, () => {
      bdh.serverMsg += port;
      process.stdout.write(bdh.serverMsg + "\n");
      done();
    });
  });

  after((done) => {
    noCbServer.close(() => {
      done();
    });
  });

  it("prints a default server message with the provided port", () => {
    expect(bdh.serverMsg).to.eql("Serenity still flying on port 1234");
  });

  it("responds with a default quote on a GET request to /", (done) => {
    request("localhost:" + port)
      .get("/")
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("We've done the impossible, and that makes us mighty.");
        done();
      });
  });

  it("overrides the default quote on a GET request to /", (done) => {
    bdh.get("/", (req, res) => {
      res.send();
    });

    request("localhost:" + port)
      .get("/")
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("");
        done();
      });
  });

  it("responds with a default 404 on a bad route", (done) => {
    request("localhost:" + port)
      .get("/reavers")
      .end((err, res) => {
        expect(err).to.eql(err);
        expect(res).to.have.status(404);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("Gorramit! That ain't ruttin' here! (404: Not Found)");
        done();
      });
  });

  it("overrides the default 404 on a bad route", (done) => {
    bdh.badRoute((req, res) => {
      res.send("Best be on your merry.");
    });

    request("localhost:" + port)
      .get("/miranda")
      .end((err, res) => {
        expect(err).to.eql(err);
        expect(res).to.have.status(404);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("Best be on your merry.");
        done();
      });
  });

  it("writes a JSON file and responds with JSON on a POST request to /serenity", (done) => {
    request("localhost:" + port)
      .post("/serenity")
      .send({ "Wash": "I'm a leaf on the wind" })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "application/json");
        expect(res.body.Wash).to.eql("I'm a leaf on the wind");
        done();
      });
  });

  it("responds with a JSON serialized object on a PUT request to /mal", (done) => {
    request("localhost:" + port)
      .put("/mal")
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "application/json");
        expect(res.body.Mal).to.eql("I aim to misbehave.");
        done();
      });
  });

  it("responds with a JSON serialized array on a PATCH request to /jayne", (done) => {
    request("localhost:" + port)
      .patch("/jayne")
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "application/json");
        expect(res.body.join(" ")).to.eql("I'll be in my bunk.");
        done();
      });
  });

  it("responds with a buffer on a DELETE request to /kaylee", (done) => {
    request("localhost:" + port)
      .delete("/kaylee")
      .end((err, res) => {
        var str = res.text.toString("utf8");

        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "text/plain");
        expect(str).to.eql("To hell with this, I'm gonna live!");
        done();
      });
  });
});

describe("server started with callback", () => {
  var cbServer;
  var serverMsg;

  before((done) => {
    cbServer = bdh.listen(port, () => {
      serverMsg = "Big damn heroes, sir.";
      process.stdout.write(serverMsg + "\n");
      done();
    });
  });

  after((done) => {
    cbServer.close(() => {
      done();
    });
  });

  it("overrides the default server message", () => {
    expect(serverMsg).to.eql("Big damn heroes, sir.");
  });
});
