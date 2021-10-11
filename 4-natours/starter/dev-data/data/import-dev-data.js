const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../", "../", "config.env") });

console.log(__dirname);

const Tour = require("../../models/tourModel");

const DB = process.env.DATABASE1?.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);
// console.log(DB);
mongoose.connect(DB).then((con) => {
  console.log("Database connection successfully established");
});

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours-simple.json"), "utf-8")
  // fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// IMPORT DATA TO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data was imported successfully");
  } catch (err) {
    console.error(err.message);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data was deleted successfully");
  } catch (err) {
    console.error(err.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
