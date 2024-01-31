
const comments = [
    { id: 1, event_id: 1, user_id: 1, comment: 'Great event!' },
    { id: 2, event_id: 2, user_id: 2, comment: 'Looking forward to it!' },
  ];
  

  exports.leaveComment = (req, res) => {
    const eventId = parseInt(req.params.eventId);

    res.status(201).json({ message: 'Comment added successfully.' });
  };
  