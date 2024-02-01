const Ticket = require("../model/ticket-model");
const Event = require("../model/event-model");

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
        $group: {
          _id: "$eventDetails._id",
          eventId: { $first: "$eventDetails._id" },
          eventName: { $first: "$eventDetails.title" },
          tickets: {
            $push: {
              ticketId: "$_id",
              ticketType: "$ticketType",
              price: "$price",
              quantity: "$quantity",
              __v: "$__v",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          eventId: 1,
          eventName: 1,
          tickets: 1,
        },
      },
    ]);

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { ticketType, quantity } = req.body;
    const userId = req.user._id;

    const validationChecks = [
      { condition: !ticketType, message: "Ticket type is required." },
      {
        condition: !quantity || quantity <= 0,
        message: !quantity
          ? "Quantity type is required."
          : "Quantity must be a positive integer.",
      },
    ];

    for (const check of validationChecks) {
      if (check.condition) {
        return res.status(400).json({ message: check.message });
      }
    }

    const availableTickets = await Ticket.find({
      event: eventId,
      ticketType: ticketType,
    });

    if (!availableTickets.length) {
      return res.status(400).json({ message: "No available tickets." });
    }

    if (availableTickets[0].quantity < quantity) {
      return res.status(400).json({ message: "Not enough tickets available." });
    }

    const purchasedTickets = availableTickets.slice(0, quantity);
    await Promise.all(
      purchasedTickets.map((ticket) => {
        ticket.user = userId;
        ticket.quantity -= quantity;
        return ticket.save();
      })
    );

    res.status(200).json({ message: "Purchase successful", purchasedTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
