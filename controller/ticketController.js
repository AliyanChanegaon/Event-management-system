const Ticket = require('../model/ticket-model');


exports.getAllTickets = async (req, res) => {
  const userId = req.user.userId; 
  console.log("hjere")
 

  try {
    const tickets = await Ticket.find({ user: userId }).populate('event', 'title');
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.purchaseTicket = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.userId; 
  const {  price, quantity } = req.body;

  try {
    const newTicket = await Ticket.create({
      event: eventId,
      user: userId,
      price,
      quantity,
    });

    res.status(201).json({ message: 'Tickets purchased successfully.', ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
