# Big-Damn-Heroes Server Framework
Big-Damn-Heroes (BDH) makes writing your server, routes, and HTTP responses easier while adding some flavor for [Firefly](https://en.wikipedia.org/wiki/Firefly_(TV_series)) fans.

## Installation
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
BDH starts a server and listens on port 3000 for connections. This app will respond with an inspirational Firefly quote for requests to the root URL (/), and with Jayne's famous one-liner for GET requests to our `/serenity` path. For every other path, it will respond with a default __404: Not Found__ message.

> Note that the `req` (request) and `res` (response) objects are the same ones that Node provides, so you can use them as you normally would without BDH involved.

Run your app with the following command:
```
$ node bdh.js
```
Then load <http://localhost:3000> in your browser to see it in action. That's it! That's all it takes to get a simple server up and running with BDH.

## Routing
Route definition takes the following structure:
```
bdh.METHOD(PATH, HANDLER)
```
Where:
 * __bdh__ is an instance of BDH.
 * __METHOD__ is an [HTTP request method](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) (GET, POST, PUT, PATCH, or DELETE only).
 * __PATH__ is a path on the server (valid string only).
 * __HANDLER__ is the function that is executed when the route is matched.

The following examples demonstrate how to define some simple routes:

Respond with a customized message on the homepage:
```javascript
bdh.get("/", (req, res) => {
  res.send("I aim to misbehave.");
});
```
Respond to a POST request on the `/jayne` route:
```javascript
bdh.post("/jayne", (req, res) => {
  res.send("I'll be in my bunk.");
});
```
Respond to a DELETE request on the `/wash` route:
```javascript
bdh.delete("/wash", (req, res) => {
  res.send("I'm a leaf on the wind.");
});
```

## API

### Application
Create an instance of the BDH framework:
```javascript
const bdh = require("big-damn-heroes");
```

#### bdh.get(path, callback)
Routes HTTP GET requests to the specified path with the provided callback function.
```javascript
bdh.get("/kaylee", (req, res) => {
  res.send("To hell with this! I'm gonna live!");
});
```

#### bdh.post(path, callback)
Routes HTTP POST requests to the specified path with the provided callback function.

#### bdh.put(path, callback)
Routes HTTP PUT requests to the specified path with the provided callback function.

#### bdh.patch(path, callback)
Routes HTTP PATCH requests to the specified path with the provided callback function.

#### bdh.delete(path, callback)
Routes HTTP DELETE requests to the specified path with the provided callback function.

#### bdh.badRoute(callback)
Overrides the default __404: Not Found__ behavior when a callback function is provided:
```javascript
bdh.badRoute((req, res) => {
  res.send("Best be on your merry.");
});
```

#### bdh.listen(port[, callback])
Returns an instance of an HTTP server and starts it using the indicated port. It also prints a poignant message with the port information to the console, but this default behavior can be overridden by providing an optional callback function:
```javascript
bdh.listen(3000, () => {
  console.log("I swear by my pretty floral bonnet, I will end you.");
});
```

### Response
The `res` object represents the HTTP response that BDH sends when it receives an HTTP request.

#### res.send([body])
Sends a simple HTTP response.

The `body` parameter can be a `String`, an object, an `Array`, or a `Buffer` object representing a string. It automatically sets the `Content-Type` header field based on the input, sets the appropriate status code, and ends the response. Objects and arrays are automatically JSON serialized. If no `body` parameter is supplied, an empty string will be written to the response.
