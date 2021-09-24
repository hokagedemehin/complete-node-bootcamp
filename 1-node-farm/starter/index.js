const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

const PORT = 8000;

const data = fs.readFileSync(
  path.join(__dirname, "dev-data", "data.json"),
  "utf-8"
);

const tempOverview = fs.readFileSync(
  path.join(__dirname, "templates", "template-overview.html"),
  "utf-8"
);
const tempCard = fs.readFileSync(
  path.join(__dirname, "templates", "template-card.html"),
  "utf-8"
);
const tempProduct = fs.readFileSync(
  path.join(__dirname, "templates", "template-product.html"),
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === "/api") {
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
