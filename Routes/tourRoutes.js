const express = require('express');
const router = express.Router();

const tourController = require('D:/complete-node-bootcamp-master/4-natours/starter/Controllers/tourControllers.js');
// const { allTour, }=require('D:\complete-node-bootcamp-master/4-natours/starter/Controllers/tourControllers.js'); -- destructing

//create a checkBody middleware
//check if body contains the name and price property
//if not send 404
//add it to post handler stack

// router.param('id', tourController.checkId);
router
  .route('/top-5-cheapest')
  .get(tourController.aliasTopTours, tourController.allTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.allTour)
  .post(tourController.checkBody, tourController.createTour); //bheckbody is middleware
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
