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
    const comments = await Comment.aggregate([
        {
            $group: {
                _id: "$user",
                user: { $first: "$user" },
                comments: { $push: "$comment" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "organizerDetails",
            },
        },
        {
            $unwind: "$organizerDetails",
        },
        {
            $project: {
                organizerId: "$_id",
                organizerUsername: "$organizerDetails.username",
                comments: 1,
                _id: 0, 
            },
        },
    ]);

    res.status(200).json(comments);
}catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


