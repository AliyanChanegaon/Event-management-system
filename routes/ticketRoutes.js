const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticketController');

router.get('/', ticketController.getAllTickets);
router.post('/:eventId', ticketController.purchaseTicket);


module.exports = router;
