const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // ######## SOLUTION 1 ################
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) {
  //     console.error(err);
  //   }
  //   res.end(data);
  // });

  // ######## SOLUTION 2 ################
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on("end", () => {
  //   res.end();
  // });
  // readable.on("error", (err) => {
  //   console.error(err);
  //   res.statusCode = 500;
  //   res.end("File not found");
  // });

  // ######## SOLUTION 3 ################
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  // readableSource.pipe(writeableDestination);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening for requests...");
});
