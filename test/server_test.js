const fs = require("fs");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const bdh = require(__dirname + "/../lib/big-damn-heroes");

describe("big damn heroes server", () => {
  var bdhServer;

  before(() => {
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

    bdhServer = bdh.listen(8888);
  });

  after((done) => {
    bdhServer.close(() => {
      done();
    });
  });

  it("responds with a default quote on a GET request to /", (done) => {
    request("localhost:8888")
      .get("/")
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("We've done the impossible, and that makes us mighty.");
        done();
      });
  });

  it("responds with a new quote on a GET request to /", (done) => {
    bdh.get("/", (req, res) => {
      res.send("Big damn heroes, sir.");
    });

    request("localhost:8888")
      .get("/")
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("Big damn heroes, sir.");
        done();
      });
  });

  it("responds with a default 404 on a bad route", (done) => {
    request("localhost:8888")
      .get("/reavers")
      .end((err, res) => {
        expect(err).to.eql(err);
        expect(res).to.have.status(404);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("Gorramit! That ain't ruttin' here! (404: Not Found)");
        done();
      });
  });

  it("responds with a new 404 on a bad route", (done) => {
    bdh.badRoute((req, res) => {
      res.send("Best be on your merry.");
    });

    request("localhost:8888")
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
    request("localhost:8888")
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
    request("localhost:8888")
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
    request("localhost:8888")
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
    request("localhost:8888")
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
