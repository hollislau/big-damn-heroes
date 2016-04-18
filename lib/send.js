module.exports = function (data) {
  var mimeType;

  function isJSON(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  if (typeof data === "string") {
    if (isJSON(data)) {
      mimeType = "application/json";
    } else {
      mimeType = "text/plain";
    }
  }

  if (typeof data === "object") {
    if (Buffer.isBuffer(data)) {
      mimeType = "text/plain";
    } else {
      mimeType = "application/json";
      data = JSON.stringify(data);
    }
  }

  this.writeHead(this.status, { "Content-Type": mimeType });
  this.write(data);
  this.end();
};
