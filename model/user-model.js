const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchasedTickets: [
    {
      ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
      },
      type: String,
      price: Number,
      quantity: Number,
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
// {
//   "username": "john_doe",
//   "email": "john.doe@example.com",
//   "password": "securepassword123",
//   "purchasedTickets": [
//     {
//       "event_id": "event123",
//       "event_name": "Example Event",
//       "type": "General Admission",
//       "price": 20.00,
//       "quantity": 2
//     },
//     {
//       "event_id": "event456",
//       "event_name": "VIP Gala",
//       "type": "VIP",
//       "price": 50.00,
//       "quantity": 1
//     }
//   ]
// }