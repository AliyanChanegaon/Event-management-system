const Ticket = require("../model/ticket-model");
const User = require("../model/user-model");

exports.getAllTickets = async (_, res) => {
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

exports.getTicketById = async (req, res) => {
  const ticketId = req.params.ticketId;

  try {
    const ticket = await Ticket.findOne({ _id: ticketId });

    if (ticket) {
      res.status(200).json(ticket);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { ticketType, quantity } = req.body;
    const userId = req.user;

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
    const user = await User.findOne({ _id: userId });

    const purchasedTickets = availableTickets.slice(0, quantity);

    await Promise.all(
      purchasedTickets.map(async (ticket) => {
        const existingTicketIndex = user.purchasedTickets.findIndex(
          (purchasedTicket) =>
            purchasedTicket.ticket_id.toString() === ticket._id.toString()
        );

        if (existingTicketIndex !== -1) {
          const newPrice= user.purchasedTickets[existingTicketIndex].price + ticket.price * quantity ;
          user.purchasedTickets[existingTicketIndex].quantity += quantity;
          user.purchasedTickets[existingTicketIndex].price = newPrice;
        } else {
          user.purchasedTickets.push({
            ticket_id: ticket._id,
            type: ticketType,
            price: ticket.price * quantity,
            quantity: quantity,
          });
        }

        await user.save();

        ticket.user = userId;
        ticket.quantity -= quantity;

        await ticket.save();
      })
    );

    res
      .status(200)
      .json({ message: "Purchase successful", purchasedTickets, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
