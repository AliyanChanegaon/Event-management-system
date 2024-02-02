const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  comments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false }],
  tickets : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true }],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true },
    }
  ],
  isDeleted: { type: Boolean, default: false },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
