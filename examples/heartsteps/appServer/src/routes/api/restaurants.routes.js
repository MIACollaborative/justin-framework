import express from 'express';
import RestaurantsCtrl from '../../controllers/restaurants.controller.js';
import ReviewsCtrl from '../../controllers/reviews.controller.js';

const router = express.Router();

router.route('/').get(RestaurantsCtrl.apiGetRestaurants);
// router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById)
// router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines)

router
  .route('/review')
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);

export default router;
