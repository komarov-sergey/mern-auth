const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(`DB connection error: ${err}`));

//import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(morgan("dev"));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `http://localhost:3000` }));
}

//middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.port || 8000;
app.listen(port, () => {
  console.log(`API is running on port ${port} env = ${process.env.NODE_ENV}`);
});
