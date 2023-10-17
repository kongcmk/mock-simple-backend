const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config(); 

const app = express();
const PORT = 3000;
const DATABASE_URL = process.env.MONGODB_URL;

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected Successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error); // Corrected error message
    }
}

// Use the function to connect to the database
connectToDatabase();

// Middleware
app.use(morgan('tiny'));
app.use(express.json()); // Corrected missing parentheses
app.use(bodyParser.json());
app.use(cors());


//router
app.use('/register',  require('./routes/registerRoutes.js'))
app.use('/login', require('./routes/loginRoutes.js'))
app.use('/user', require('./routes/userRoutes.js'));

//activity routes
app.use('/activity', require('./routes/activityRoutes.js'))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); // Corrected log message
