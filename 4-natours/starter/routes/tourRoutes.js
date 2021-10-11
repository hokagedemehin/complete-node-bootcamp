const express = require("express");
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

router.route("/").get(getAllTours).post(createTour);

router
  .route("/:id/:optional?")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
