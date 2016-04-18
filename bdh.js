const bdh = require(__dirname + "/big-damn-heroes");

bdh.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.send("I'm a leaf on the wind, watch how I soar.");
  res.end();
});

bdh.get("/serenity", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.send("<h1>You can't stop the signal!</h1>");
  res.end();
});

bdh.badRoute((req, res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.send("Best be on your merry.");
  res.end();
});

bdh.listen(3000, () => {
  process.stdout.write("Server up on port 3000\n");
});
