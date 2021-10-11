const EventEmitter = require("events");
const http = require("http");

// const myEmitter = new EventEmitter();

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Ibk");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are ${stock} new stock`);
});

myEmitter.emit("newSale", 9);

// ####################################################################

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request Recieved");
  res.end("Request recieved 🍟");
});
server.on("request", (req, res) => {
  console.log("Request Recieved");
  // res.end("Request recieved 🥗");
});

server.on("close", (req, res) => {
  console.log("Server is closed 🍻");
});

server.listen(8000, "localhost", () => {
  console.log("Waiting for requests...");
});
