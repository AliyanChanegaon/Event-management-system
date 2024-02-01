const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');

router.post('/:eventId', commentController.leaveComment);
router.get('/', commentController.getAllComments);

module.exports = router;
