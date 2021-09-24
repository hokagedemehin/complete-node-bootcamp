const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

const PORT = 8000;

const data = fs.readFileSync(
  path.join(__dirname, "dev-data", "data.json"),
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/overview") {
    return res.end("This is the overview page");
  } else if (pathName === "/product") {
    return res.end("This is the product page");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h2>404 Not Found here, input the right URL</h2>");
    // res.send("Page not found");
    // return res.status(404).end("Sorry, we cannot find that!");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening at port ${PORT}`);
});
