// const path = require("path");
// const fs = require("fs");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
// const { match } = require("assert");

// const checkID = (req, res, next, val) => {
//   console.log(`Tour ID is ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({ status: "Fail", error: "Invalid ID" });
//   }
//   next();
// };

// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: "Fail",
//       error: "Missing Name of Price, they are required",
//     });
//   }
//   next();
// };

const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = async (req, res) => {
  // console.log(req.requestTime);

  try {
    // BUILD QUERY
    //  1A) FILTERING
    // const queryObj = { ...req.query };
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((field) => delete queryObj[field]);

    // // 1B) ADVANCE FILTERING
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));

    // // 2) ADVANCE SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // 3) FIELD LIMITING
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // 4) PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error("This page does not contain any data");
    //   }
    // }

    // 5) EXECUTE QUERY & Class APIFeature execution
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features?.query;
    // const tours = await query;

    // const query = await Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    res.status(200).json({
      status: "Success",
      requestedAt: req.requestTime,
      results: tours?.length,
      // data: JSON.stringify(tours),
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", message: err.message });
  }
};

const getTour = async (req, res) => {
  // console.log(req.params);
  // const id = +req.params.id; // or req.params.id * 1  or Num(req.params.id)

  // const tour = tours.find((el) => el.id === id);
  // console.log(tour.name);
  // if (id > tours.length || !tour) {
  //   return res.status(404).json({ status: 'Fail', error: 'Invalid ID' });
  // }
  try {
    // console.log(req.params.id);
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: "Success",
      // results: tour.length,
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", message: err.message });
  }
};

const createTour = async (req, res) => {
  // console.log(req.body);
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  // console.log(newTour);
  // tours.push(newTour);
  // fs.writeFile(
  //   path.join(__dirname, "..", "dev-data", "data", "tours-simple.json"),
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({ status: "success", data: { tour: newTour } });
  //   }
  // );
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: "success", data: { tour: newTour } });
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
};

const updateTour = async (req, res) => {
  // console.log(req.params);
  // const id = +req.params.id; // or req.params.id * 1  or Num(req.params.id)

  // const tour = tours.find((el) => el.id === id);
  // const newTour = Object.assign({ id: id }, req.body);

  // if (id > tours.length || !tour) {
  //   return res.status(404).json({ status: 'Fail', error: 'Invalid ID' });
  // }

  // for (const elem of Object.keys(newTour)) {
  //   // console.log(`${elem}: ${tour[elem]}, newTour: ${newTour[elem]}`);
  //   tour[elem] = newTour[elem];
  // }
  // console.log(tour);
  // tours[id] = tour;

  // const newTours = tours[id];
  // fs.writeFile(
  //   path.join(__dirname, "..", "dev-data", "data", "tours-simple.json"),
  //   JSON.stringify(tours),
  //   (err) => {
  //     res
  //       .status(200)
  //       .json({ status: "success", data: { edittedTour: newTours } });
  //   }

  // );
  try {
    const tours = await Tour.find();
    console.log(req.params.id);
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { updatedTour: tour } });
  } catch (err) {
    res.status(404).json({ status: "Failure", message: err.message });
  }
  // console.log(tour.name);

  // res.status(200).json({
  //   status: 'Success',
  //   // results: tour.length,
  //   data: { tour },
  // });
};

const deleteTour = async (req, res) => {
  // const id = +req.params.id; // or req.params.id * 1  or Num(req.params.id)

  // const tour = tours.find((el) => el.id === id);
  // console.log(tour.name);
  // if (id > tours.length) {
  //   return res.status(404).json({ status: 'Fail', error: 'Invalid ID' });
  // }
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
      // results: tour.length,
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", message: err.message });
  }
};

const getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: "Success",
      requestedAt: req.requestTime,
      results: stats?.length,
      // data: JSON.stringify(tours),
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", message: err.message });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({
      status: "Success",
      requestedAt: req.requestTime,
      results: plan?.length,
      // data: JSON.stringify(tours),
      data: { plan },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", message: err.message });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  // checkID,
  // checkBody,
};
