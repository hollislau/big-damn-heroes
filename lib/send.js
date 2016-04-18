module.exports = function (data) {
  var mimeType;

  if (typeof data === "string") {
    mimeType = "text/plain";
  }

  if (typeof data === "object") {
    if (Buffer.isBuffer(data)) {
      mimeType = "application/octet-stream";
    }
    mimeType = "application/json";
    data = JSON.stringify(data);
  }

  this.writeHead(200, { "Content-Type": mimeType });
  this.write(data);
  this.end();
};
