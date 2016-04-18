# Big-Damn-Heroes Server Framework
Big-Damn-Heroes (BDH) makes writing your server, routes, and HTTP responses easier while adding a bit of flavor for Firefly fans.

## Installing
Assuming you've already installed [Node.js](https://nodejs.org/), get started by using `npm init` to create a `package.json` file in your project directory:
```
$ npm init
```
To use this package, install BDH as a dependency:
```
$ npm install big-damn-heroes --save
```
Or install it temporarily and don't include it in your dependencies list:
```
$ npm install big-damn-heroes
```

## Quick Start Guide
In your project directory, create a file named `bdh.js` and add the following code:
```javascript
const bdh = require("big-damn-heroes");

bdh.get("/serenity", (req, res) => {
  res.send("Shiny. Let's be bad guys.");
});

bdh.listen(3000);
```
BDH starts a server and listens on port 3000 for connections. This app will respond with a default Firefly quote for requests to the root URL (/), and with Jayne's famous one-liner for GET requests to our  `/serenity` path. For every other path, it will respond with a default __404: Not Found__ quote.

> Note that the `req` (request) and `res` (response) objects are the same ones that Node provides, so you can use them as you normally would without BDH involved.

Run your app with the following command:
```
$ node bdh.js
```
Then load `http://localhost:3000` in your browser to see it in action. That's it! That's all you need to get a simple server up and running with BDH.

## Routing
Route definition takes the following structure:
```
bdh.METHOD(PATH, CALLBACK)
```
Where:
* __bdh__ is an instance of BDH.
* __METHOD__ is an HTTP request method (GET, POST, PUT, PATCH, or DELETE).
* __PATH__ is a path on the server (valid string only).
* __CALLBACK__ is the function that is executed when the route is matched.

The following examples demonstrate how to define some simple routes:

Respond with "I aim to misbehave." on the homepage:
```javascript
bdh.get("/", (res, req) => {
  res.send("I aim to misbehave.");
});
```
Respond to a POST request on the `/jayne` route:
```javascript
bdh.post("/jayne", (res, req) => {
  res.send("I'll be in my bunk.");
});
```
Respond to a DELETE request on the `/wash` route:
```javascript
bdh.delete("/wash", (res, req) => {
  res.send("I'm a leaf on the wind.");
});
```
## API
### Application
```javascript
const bdh = require("big-damn-heroes");
```
#### bdh.badRoute(cb)
Allows a user to override the default 404 behavior by providing a callback function:
```javascript
bdh.badRoute((req, res) => {
  res.send("Best be on your merry.");
});
```

#### bdh.listen(port [, cb])
bdh.listen() will by default print a message to the console showing the port on which your server is running. You can override this behavior by providing an optional callback function.
```javascript
bdh.listen(3000, () => {
  console.log("I swear by my pretty floral bonnet, I will end you.");
});
```

### Response
#### res.send([body])
Sends a simple HTTP response.

The `body` parameter can be a `String`, an object, an `Array`, or a `Buffer` object containing a string. It automatically sets the `Content-Type` header field based on the input, sets the appropriate status code, and ends the response. Objects and arrays are automatically JSON serialized.
