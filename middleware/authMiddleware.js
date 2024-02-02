const jwt = require('jsonwebtoken');
const tokenBlacklist = [];

const authenticateToken = (req, res, next) => {
    let token;
    if(req.header("Authorization")){
         token = req.header("Authorization").split(" ")[1];
    }
  

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }


  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: "Unauthorized: Token has been blacklisted" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      
      tokenBlacklist.push(token);

      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = user.userId;
    next();
  });
};


const addToBlacklist = (tokens) => {
  tokenBlacklist.push(tokens);
 
};

module.exports = {
  authenticateToken,
  addToBlacklist,
};
