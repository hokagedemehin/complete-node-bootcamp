const { promisify } = require("util");
const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");
var jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieeOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieeOptions.secure = true;

  res.cookie("jwt", token, cookieeOptions);

  user.password = undefined;

  res.status(statusCode).json({ status: "success", token, data: { user } });
};

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);

  // const token = signToken(newUser._id);

  // res.status(201).json({ status: "success", token, data: { user: newUser } });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) check if user exist and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }
  // 3) if everythins is ok, send token to client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({ status: "success", token });
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check if it exist
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization?.split(" ")[1];
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  // 2) Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exist", 401)
    );
  }

  // 4) CHeck if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password, please login again", 401)
    );
  }
  // 5) Grant access to protect route if it gets to this point
  req.user = currentUser;
  // console.log(`protected user: ${req.user}`);
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array of [admin, lead-guide]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address", 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //  3) Send it to user email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? \n\nSubmit a new request with your new password and also confirm the password to: ${resetURL}. \n\nIf you are not the one who made this request, please ignore this email. \n\nHave a productive day and thank you for trusting us with your time`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (Only Valid for 10 Min !!!)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Your password reset token was sent to your email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error(err);
    return next(
      new AppError("There was an error sending this error, try again !", 500)
    );
  }
});
const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) if token has not expired and there is user set new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPassword property for the user
  createSendToken(user, 200, res);

  // const token = signToken(user._id);
  // res.status(200).json({ status: "success", token });
  // 4) Log in the user and send JWT
});

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from the collection

  // findByIdAndUpdate will not work because no validator will run and also the also the pre functions middlewares also will not run

  const user = await User.findById(req.user.id).select("+password");
  // 2) check if the posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect", 401));
  }
  // 3) update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) log user in with new password
  createSendToken(user, 200, res);
});

module.exports = {
  signUp,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
