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

  it("responds with a default 404 on a bad route", (done) => {
    request("localhost:8888")
      .get("/reavers")
      .end((err, res) => {
        expect(err).to.eql(err);
        expect(res).to.have.status(404);
        expect(res).to.have.header("content-type", "text/plain");
        expect(res.text).to.eql("Gorramit! That ain't ruttin' here!");
        done();
      });
  });

  it("writes a JSON file on a POST request to /serenity", (done) => {
    request("localhost:8888")
      .post("/serenity")
      .send({ "Wash": "I'm a leaf on the wind" })
      .end((err, res) => {
        var parsed = JSON.parse(res.text);

        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "application/json");
        expect(parsed.Wash).to.eql("I'm a leaf on the wind");
        done();
      });
  });
});
