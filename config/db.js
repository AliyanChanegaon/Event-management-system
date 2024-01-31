const mongoose = require("mongoose");
const uri =process.env.MONGODB_URI;


async function connect() {
   
  mongoose.set("strictQuery", false);
  try {
    console.log("connected");
    await mongoose.connect(uri);
  } catch (e) {
    console.log("error");
  }
}

module.exports = connect;
