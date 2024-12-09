const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://saurabh931:yadav__123@saurabhdb.ofmpoio.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connection is successfull with Database");
  })
  .catch((e) => {
    console.log("Could not connected with Database", e);
  });
