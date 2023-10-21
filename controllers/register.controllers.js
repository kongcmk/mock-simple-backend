const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const Joi = require("joi"); // Import Joi for validation

// Define the validation schema using Joi
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(32).required(),
  password: Joi.string().min(6).required(),
  // Add more fields and validation rules as needed
});
//create user
exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const { error } = userSchema.validate({ username, password });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username Existing " });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registration successful" });
  } catch (error) {
    res.status(500).json({ error: " Register Error" });
  }
};
