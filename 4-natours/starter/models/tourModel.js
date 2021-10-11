const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour name is required"],
      unique: true,
      trim: true,
      maxLength: [50, "Tour name must be less than 50 characters"],
      minLength: [5, "Tour name must be greater than 5 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    slug: { type: String },
    duration: {
      type: Number,
      required: [true, "A tour duration is required"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour max group size is required"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour difficulty is required"],
      enum: {
        values: ["easy", "medium", "hard", "difficult"], // This enum only works for strings
        message: "You can only choose one of the four options available",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be greater than 1"],
      max: [5, "Rating must be less than 5"],
    },
    price: { type: Number, required: [true, "A tour price is required"] },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, "A tour price is required"] },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        // This only points to current document on creation and cannot work on updates
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be less than actual price",
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour summary is required"],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      trim: true,
      required: [true, "A cover is required"],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return Math.ceil(this.duration / 7);
});

// DOCUMENT MIDDLEWARE - runs before .save() and .create() / you can only run with "save" or "create" inside the pre and post middleware
tourSchema.pre("save", function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next()
// })

// QUERY MIDDLEWARE - runs with only "find" hook
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (doc, next) {
  // console.log(doc);
  // console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// tourSchema.pre("find", function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
