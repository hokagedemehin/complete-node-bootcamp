const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥💥 existing the program...");
  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: path.join(__dirname, "config.env") });

// console.log(dotenv.config({ path: path.join(__dirname, "config.env") }));
const app = require("./app");

const DB = process.env.DATABASE1?.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);
mongoose.connect(DB).then((con) => {
  // console.log(con.connections);
  console.log("Database connection successfully established");
});

// const testTour = new Tour({
//   name: "The Island Hiker",
//   rating: 4.2,
//   price: 401,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.error("ERROR 💥:", err.message);
//   });

// console.log(app.get('env'));
// console.log(process.env);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
