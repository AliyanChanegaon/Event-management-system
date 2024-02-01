const Ticket = require('../model/ticket-model');


exports.getAllTickets = async (req, res) => {
 

  try {
    const tickets = await Ticket.aggregate([
    
      {
        $lookup: {
          from: "events", 
          localField: "event",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $unwind: "$eventDetails",
      },
      {
        $lookup: {
          from: "users", 
          localField: "eventDetails.organizer",
          foreignField: "_id",
          as: "organizerDetails",
        },
      },
      {
        $unwind: "$organizerDetails",
      },
      {
        $group: {
          _id: "$organizerDetails._id",
          organizerDetails: { $first: "$organizerDetails" },
          tickets: {
            $push: {
              eventId: "$eventDetails._id",
              eventName: "$eventDetails.title",
              eventType: "$ticketType",
              price: "$price",
              quantity: "$quantity",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          organizerId: "$organizerDetails._id",
          organizerUsername: "$organizerDetails.username",
          tickets: 1,
        },
      },
    ]);

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
