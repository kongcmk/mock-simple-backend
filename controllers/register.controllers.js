const bcrypt = require('bcrypt');
const User = require("../models/user.js");

//create user 
exports.createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({error : "Username Existing "})
            
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser = await User({username, password: hashedPassword});
        await newUser.save();
        
        res.status(201).json({message : "Create user complete"})
    } catch (error) {
        res.status(500).json({ error: " Register Error"})
    }
}; 