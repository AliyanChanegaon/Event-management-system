require("dotenv").config();
const connect = require("./config/db");
const express = require("express");
const authMiddleware = require('./middleware/authMiddleware')
const app = express();
const cors = require("cors");
const port = 3000;

const authRoute = require("./routes/authRoute");
const eventRoute = require("./routes/eventRoutes");
const ticketRoute = require("./routes/ticketRoutes");
const commentRoute = require("./routes/commentRoutes");


app.use(express.json());
app.use(cors());


app.use("/auth",authRoute);
app.use("/events",authMiddleware.authenticateToken, eventRoute);
app.use("/tickets", authMiddleware.authenticateToken, ticketRoute);
app.use("/comments", authMiddleware.authenticateToken, commentRoute);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  connect();
});
