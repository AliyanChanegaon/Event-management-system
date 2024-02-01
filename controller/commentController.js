const Comment = require('../model/comment-model');
const User = require('../model/user-model');
const Event = require('../model/event-model');
exports.leaveComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { comment } = req.body;

   
    const userId = req.user.userId;

   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newComment = await Comment.create({
      user: userId,
      event: eventId,
      comment: comment,
    });
      
    event.comments.push(newComment._id);
    await event.save();

    res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    // const comments = await Comment.aggregate([
     
    //   {
    //     $group: {
    //       _id: "$user",
    //       user: { $first: "$user" },
    //       organizerId: { $first: "$_id" },
    //       organizerUsername: { $first: "$userDetails.username" },
    //       comments: { $push: "$comment" },
    //     },
    //   },
    //   {
    //     $project: {
    //       organizerId: 1,
    //       organizerUsername:1,
    //       comments: 1,
    //       _id: 0,
    //     },
    //   },
    // ]);
    const comments = await Comment.aggregate([
      {
        $lookup: {
          from: "events", // Replace with the actual name of the Event collection
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
          from: "users", // Replace with the actual name of the User collection
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
}catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


