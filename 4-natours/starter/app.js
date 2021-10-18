const fs = require("fs");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const { errorMiddle } = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss = require("xss-clean");

const app = express();

// ############ GLOBAL MIDDLEWARES ######################

// DEVELOPMENT LOGGING TO CONSOLE
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("combined"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

// SET SECURITY HTTP
app.use(helmet());

// LIMITS REQUEST TO API
app.use("/api", limiter);
// app.use(morgan('dev'));

// BODY PARSER TO JSON FORMAT
app.use(express.json());

// DATA SANITIZATION AGAINST NOSQL QUERY INJECT
app.use(mongoSanitize());
// DATA SANITIZATION AGAINST CROSS SITE SQL ATTACKS XXS
app.use(xss());

// PREVENT PARAMETER POLLUTIONS
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
      "maxGroupSize",
      "difficulty",
      "startDates",
    ],
  })
);

// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("Hello from middleware 😎🤗");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from Express Server !!!',
//     app: 'Natours Application',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('This will be posted to homepage!!!');
// });

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );
// const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)

// ############ ROUTE HANDLERS ###############

// app.get('/api/v1/tours', getAllTours);

// optinal? => this means this parameter is optional when making the api call to this url
// app.get('/api/v1/tours/:id/:optional?', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id/:optional?', updateTour);

// app.delete('/api/v1/tours/:id/:optional?', deleteTour);

// ############ ROUTES ###############
// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter.route('/').get(getAllTours).post(createTour);

app.use((req, res, next) => {
  console.log("Hello from middleware after first route 😎🤗");
  next();
});

// tourRouter
//   .route('/:id/:optional?')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "Fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "Fail";
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorMiddle);

module.exports = app;
