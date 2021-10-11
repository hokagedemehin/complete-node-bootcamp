const path = require("path");
const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllUsers = (req, res) => {
  res.status(500).json({ status: "Error", error: "Route not implemented" });
};
const getUser = (req, res) => {
  res.status(500).json({ status: "Error", error: "Route not implemented" });
};
const createUser = (req, res) => {
  res.status(500).json({ status: "Error", error: "Route not implemented" });
};
const updateUser = (req, res) => {
  res.status(500).json({ status: "Error", error: "Route not implemented" });
};
const deleteUser = (req, res) => {
  res.status(500).json({ status: "Error", error: "Route not implemented" });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
