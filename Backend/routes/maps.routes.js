const express = require('express');
const router = express.Router();

const { authUser } = require('../middlewares/auth.middleware'); // assumes named export
const {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
} = require('../controllers/maps.controller');

const { query } = require('express-validator');

// Debug logs — optional: remove after confirming it's working
console.log('typeof authUser:', typeof authUser);
console.log('typeof getCoordinates:', typeof getCoordinates);
console.log('typeof getDistanceTime:', typeof getDistanceTime);
console.log('typeof  getAutoCompleteSuggestions:', typeof  getAutoCompleteSuggestions);



router.get(
  '/get-coordinates',
  query('address').isString().isLength({ min: 3 }),
  authUser,
  getCoordinates
);

router.get(
  '/get-distance-time',
  query('origin').isString().isLength({ min: 3 }),
  query('destination').isString().isLength({ min: 3 }),
  authUser,
  getDistanceTime
);

router.get(
  '/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authUser,
    getAutoCompleteSuggestions
);
module.exports = router;
