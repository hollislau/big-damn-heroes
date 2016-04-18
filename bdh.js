const bdh = require(__dirname + "/big-damn-heroes");

bdh.get("/", (req, res) => {
  res.send([1, 2, 3]);
});

bdh.get("/serenity", (req, res) => {
  res.send("You can't stop the signal!");
});

bdh.badRoute((req, res) => {
  res.send("Best be on your merry.");
});

bdh.listen(3000, () => {
  process.stdout.write("Server up on port 3000\n");
});
