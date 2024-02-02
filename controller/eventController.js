const Event = require("../model/event-model");
const Ticket = require("../model/ticket-model");
const User = require("../model/user-model");

exports.getAllEvents = async (req, res) => {
  try {
    const { title, date, location } = req.query;

    const match = {};
    if (title) match.title = { $regex: new RegExp(title, "i") };
    if (date) match.date = new Date(date);
    if (location) match.location = { $regex: new RegExp(location, "i") };
    match.isDeleted = false;
    const events = await Event.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: "users",
          localField: "organizer",
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
          organizerId: { $first: "$organizerDetails._id" },
          organizerUsername: { $first: "$organizerDetails.username" },
          events: {
            $push: {
              _id: "$_id",
              title: "$title",
              description: "$description",
              date: "$date",
              time: "$time",
              location: "$location",
              organizer: "$organizer",
              comments: "$comments",
              tickets: "$tickets",
              rating: "$rating",
              isDeleted: "$isDeleted",
              __v: "$__v",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          organizerId: 1,
          organizerUsername: 1,
          events: 1,
        },
      },
    ]);
    if (events && events.length !== 0) {
      res.status(200).json(events);
    } else {
      res.status(404).json({ message: "No Events found" });
    }
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
      .populate("comments")
      .populate("tickets");

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
  const userId = req.user;
  try {
    eventData.comments = [];
    eventData.tickets = [];
    const { generalTickets, vipTickets, frontRowTickets } = req.body;
    if (!generalTickets || !vipTickets || !frontRowTickets) {
      const missingTickets = [];
      if (!generalTickets) missingTickets.push("General Admission");
      if (!vipTickets) missingTickets.push("VIP");
      if (!frontRowTickets) missingTickets.push("Front Row");

      const errorMessage = `Missing ticket information for: ${missingTickets.join(
        ", "
      )}`;
      return res.status(400).json({ message: errorMessage });
    }

    const newEvent = await Event.create({
      ...eventData,
      organizer: userId,
      rating: [],
      tickets: [],
      isDeleted: false,
    });

    const tickets = [];

    if (generalTickets && generalTickets.quantity > 0) {
      tickets.push({
        ticketType: "General Admission",
        user: userId,
        price: generalTickets.price,
        quantity: generalTickets.quantity,
        event: newEvent._id,
      });
    }

    if (vipTickets && vipTickets.quantity > 0) {
      tickets.push({
        ticketType: "VIP",
        user: userId,
        price: vipTickets.price,
        quantity: vipTickets.quantity,
        event: newEvent._id,
      });
    }

    if (frontRowTickets && frontRowTickets.quantity > 0) {
      tickets.push({
        ticketType: "Front Row",
        user: userId,
        price: frontRowTickets.price,
        quantity: frontRowTickets.quantity,
        event: newEvent._id,
      });
    }

    const createdTickets = await Ticket.create(tickets);

    const ticketIds = createdTickets.map((ticket) => ticket._id);

    newEvent.tickets = ticketIds;
    await newEvent.save();
    await User.findByIdAndUpdate(userId, { $push: { events: newEvent._id } });

    res
      .status(201)
      .json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.rateEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user;

  try {
    const oldEvent = await Event.findById(eventId);
    const user = await User.findOne({
      _id: userId,
      "purchasedTickets.ticket_id": { $in: oldEvent.tickets },
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "You need to buy a ticket to rate this event." });
    }

    const { rating } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Invalid rating. Please provide a rating between 1 and 5.",
      });
    }

    const event = await Event.findById(eventId);

    const userRating = event.ratings.find((ratingObj) =>
      ratingObj.user.equals(userId)
    );

    if (userRating) {
      userRating.rating = rating;
    } else {
      event.ratings.push({ user: userId, rating });
    }

    const totalRatings = event.ratings.reduce(
      (sum, ratingObj) => sum + ratingObj.rating,
      0
    );
    const averageRating = totalRatings / event.ratings.length;

    event.rating = averageRating;
    await event.save();

    res
      .status(200)
      .json({ message: "Event rated successfully.", averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const eventData = req.body;

  try {
    const disallowedFields = ["_id", "organizer", "ratings", "tickets"];

    const disallowedFieldsPresent = disallowedFields.filter(
      (field) => eventData[field]
    );

    if (disallowedFieldsPresent.length > 0) {
      const errorMessage = `Cannot update ${disallowedFieldsPresent.join(
        ", "
      )}.`;
      return res.status(400).json({ message: errorMessage });
    }

    const result = await Event.updateOne(
      { _id: eventId, isDeleted: false },
      { $set: eventData }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Event not found or already deleted." });
    }

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
