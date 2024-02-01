const Event = require("../model/event-model");
const Ticket = require("../model/ticket-model");

exports.getAllEvents = async (req, res) => {
  const userId = req.user.userId;
  try {
  
    const events = await Event.find({ isDeleted: false })
      .populate("organizer", "username")
      .populate("comments");
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getEventById = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findOne({ _id: eventId, isDeleted: false })
      .populate("organizer", "username")
      .populate("comments");
    
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createEvent = async (req, res) => {
  const eventData = req.body;
  const userId = req.user.userId;
  try {
    eventData.comments = [];
    eventData.tickets = [];
    const { generalTickets, vipTickets, frontRowTickets } = req.body;

    const newEvent = await Event.create({
      ...eventData,
      organizer: userId,
      tickets: [], // Initialize with an empty array
    });

    const tickets = [];

    if (generalTickets && generalTickets.quantity > 0) {
      tickets.push({
        ticketType: "General Admission",
        user: userId,
        price: generalTickets.price || 20,
        quantity: generalTickets.quantity,
        event: newEvent._id, // Associate the event ID with the ticket
      });
    }

    if (vipTickets && vipTickets.quantity > 0) {
      tickets.push({
        ticketType: "VIP",
        user: userId,
        price: vipTickets.price || 50,
        quantity: vipTickets.quantity,
        event: newEvent._id,
      });
    }

    if (frontRowTickets && frontRowTickets.quantity > 0) {
      tickets.push({
        ticketType: "Front Row",
        user: userId,
        price: frontRowTickets.price || 100,
        quantity: frontRowTickets.quantity,
        event: newEvent._id,
      });
    }

    const createdTickets = await Ticket.create(tickets);

    const ticketIds = createdTickets.map((ticket) => ticket._id);

    newEvent.tickets = ticketIds;
    await newEvent.save();

    res
      .status(201)
      .json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const eventData = req.body;

  try {
    await Event.updateOne(
      { _id: eventId, isDeleted: false },
      { $set: eventData }
    );
    res.status(200).json({ message: `Event ${eventId} updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    await Event.updateOne(
      { _id: eventId, isDeleted: false },
      { $set: { isDeleted: true } }
    );
    res.status(200).json({ message: `Event ${eventId} deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
