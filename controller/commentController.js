const Comment = require("../model/comment-model");
const User = require("../model/user-model");
const Event = require("../model/event-model");

exports.leaveComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { comment } = req.body;

    if(!comment){
      return res.status(400).json({ message: "comment is required" });
    }

    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const newComment = await Comment.create({
      user: userId,
      event: eventId,
      comment: comment,
    });

    event.comments.push(newComment._id);
    await event.save();

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.aggregate([
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
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $group: {
          _id: "$eventDetails._id",
          eventId: { $first: "$eventDetails._id" },
          eventName: { $first: "$eventDetails.title" },
          comments: {
            $push: {
              userID: "$userDetails._id",
              username: "$userDetails.username",
              commentId: "$_id",
              commentMessage: "$comment",
            },
          },
        },
      },
    ]);

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
