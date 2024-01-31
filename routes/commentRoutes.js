const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');

router.post('/:eventId', commentController.leaveComment);


module.exports = router;
