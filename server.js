require('dotenv').config();
const connect = require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/auth', require('./routes/authRoute'));
app.use('/events', require('./routes/eventRoutes'));
app.use('/tickets', require('./routes/ticketRoutes'));
app.use('/comments', require('./routes/commentRoutes'));


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  connect();
});
