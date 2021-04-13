const mongoose = require("mongoose");
module.exports = mongoose
  .connect("mongodb://localhost:27017/node-REST-shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
