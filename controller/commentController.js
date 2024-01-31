// commentController.js

// Dummy comment data for demonstration purposes
const comments = [
    { id: 1, event_id: 1, user_id: 1, comment: 'Great event!' },
    { id: 2, event_id: 2, user_id: 2, comment: 'Looking forward to it!' },
  ];
  
  // Leave a comment on a specific event
  exports.leaveComment = (req, res) => {
    const eventId = parseInt(req.params.eventId);
    // Implementation logic for leaving a comment
    // Validate input, add to the database, etc.
    res.status(201).json({ message: 'Comment added successfully.' });
  };
  