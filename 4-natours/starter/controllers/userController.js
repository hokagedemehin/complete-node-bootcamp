const User = require("../models/userModel");
// const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ status: "success", data: users });
});
const filterObj = (obj, ...rest) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (rest.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
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
const updateMe = catchAsync(async (req, res, next) => {
  // 1) password update not possible, throw an error here
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Password change is not possible here", 400));
  }

  // 2) filtered out only what we want to update
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) update other document except the password
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  updatedUser.name = "Jonas";
  res.status(200).json({ status: "Success", data: { user: updatedUser } });
});
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: "Success", data: null });
});
module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
