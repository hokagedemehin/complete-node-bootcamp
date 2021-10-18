const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
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
} = require("../controllers/tourController");

const router = express.Router();

// router.param('id', checkID);

router.route("/tours-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/top-5-cheap-tours").get(aliasTopTours, getAllTours);

router.route("/").get(protect, getAllTours).post(createTour);

router
  .route("/:id/:optional?")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
