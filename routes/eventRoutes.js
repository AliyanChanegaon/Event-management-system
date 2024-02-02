const express = require('express');
const router = express.Router();
const eventController = require('../controller/eventController');

router.get('/', eventController.getAllEvents);
router.get('/:eventId', eventController.getEventById);
router.post('/', eventController.createEvent);
router.patch('/:eventId', eventController.updateEvent);
router.delete('/:eventId', eventController.deleteEvent);
 router.post('/rating/:eventId', eventController.rateEvent);

module.exports = router;
