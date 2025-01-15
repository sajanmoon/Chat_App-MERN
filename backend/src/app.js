const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./routes/user");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.use("/hello", (req, res) => {
  res.send("Hello from the server");
});

connectDB()
  .then(() => {
    console.log("Database connected succesfully");
    app.listen(3000, () => {
      console.log("server started on 3000");
    });
  })
  .catch(() => {
    console.log("database connection failed");
  });
