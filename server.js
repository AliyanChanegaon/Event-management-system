require("dotenv").config();
const jwt = require("jsonwebtoken");
const connect = require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(express.json());
app.use(cors());

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {

    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
     
      req.user = user.userId;
    
    
    next();
  });
};

app.use("/auth",require("./routes/authRoute"));
app.use("/events",authenticateToken, require("./routes/eventRoutes"));
app.use("/tickets", authenticateToken, require("./routes/ticketRoutes"));
app.use("/comments", authenticateToken, require("./routes/commentRoutes"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  connect();
});
