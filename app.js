// Import necessary dependencies and your 'passport' configuration
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


require("dotenv").config();
require("./configs/passport"); // Import 'passport' configuration

const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.MONGODB_URL;

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Use the function to connect to the database
connectToDatabase();

const allowedMethods = ['GET' , 'PUT' , 'POST', 'DELETE'];
const allowedHeaders = ['Authorization' , 'Content-Type'];

app.use(cors({
    origin : 'http://localhost:5173',
    methods: allowedMethods.join(', '),
    allowedHeaders : allowedHeaders.join(', '),
    credentials: true,
}));
// Middleware
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString()); // Cache for 1 hour
  next();
});



const register = require("./routes/registerRoutes.js");
const login = require("./routes/loginRoutes.js");
const user = require("./routes/userRoutes.js");
const activity = require("./routes/activityRoutes.js");


app.use("/register", register);
app.use("/login", login);
app.use("/user", user);
// Activity routes
app.use("/activity", activity);


// Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
});


app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
