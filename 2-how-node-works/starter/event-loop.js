const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => {
  console.log("Timer 1 finished");
}, 0);

setImmediate(() => {
  console.log("Imadiate is finished");
});

fs.readFile("test-file.txt", () => {
  console.log("I / O FInsihed");

  console.log("---------------------------------");

  setTimeout(() => {
    console.log("Timer 2 finished");
  }, 0);
  setTimeout(() => {
    console.log("Timer 3 finished");
  }, 3000);

  setImmediate(() => {
    console.log("Imadiate 2 is finished");
  });

  process.nextTick(() => {
    console.log("Process Next tick");
  });

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password hashing down sync");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password hashing down sync");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password hashing down sync");

  crypto.pbkdf2("Mary09271989", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password hashing down not sync");
  });
  crypto.pbkdf2("Mary09271989", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password hashing down");
  });
  crypto.pbkdf2("Mary09271989", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password hashing down");
  });
  crypto.pbkdf2("Mary09271989", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password hashing down");
  });
});

console.log("Hello from the tp level code...");
