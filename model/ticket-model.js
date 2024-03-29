const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  ticketType: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
