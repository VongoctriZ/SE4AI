const express = require('express');
const router = express.Router();

const RecommendationController = require('../controllers/recommendation.c');

router.post('/foryou', RecommendationController.getRecommendations);

router.get('/allitems', RecommendationController.allRecommendations);

module.exports = router;