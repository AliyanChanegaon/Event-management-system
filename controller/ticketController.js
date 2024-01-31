
const tickets = [
    { id: 1, event_id: 1, user_id: 1, ticket_type: 'Regular', price: 20, quantity: 2 },
    { id: 2, event_id: 2, user_id: 2, ticket_type: 'VIP', price: 50, quantity: 1 },
  ];
  
  exports.getAllTickets = (req, res) => {

    res.status(200).json(tickets.filter((ticket) => ticket.user_id === 1)); 
  };

  exports.purchaseTicket = (req, res) => {
    const eventId = parseInt(req.params.eventId);
    res.status(201).json({ message: 'Tickets purchased successfully.' });
  };
  