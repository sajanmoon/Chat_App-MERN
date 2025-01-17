const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Correct property for credentials
  })
);

app.use("/", authRouter);
app.use("/", messageRouter);

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
