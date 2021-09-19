// Primary file of executing
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

// Config mongoose
mongoose.set("useFindAndModify", false);

// Connection DB
mongoose.connect(
  // `mongodb://${IP_SERVER}:${PORT_DB}/personal-web`, //localhost
  `mongodb+srv://alejotaliento:MERN1234@personal-web-mern.i2dzf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { userNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Connection with database successfully");

      app.listen(port, () => {
        console.log("##################");
        console.log("#### API REST ####");
        console.log("##################");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
      });
    }
  }
);
