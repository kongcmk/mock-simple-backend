const User = require("../models/user")


//GET users listing
exports.getUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find({});

        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"});
    }
};

//GET user profile 
exports.getUser = async (req, res, next) => {
        const userID = req.user.id
    try {
        const user = await User.findById(userID)
        res.status(200).json(user);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"});
    }
};


//PUT user
exports.editUser = async (req, res, next) => {
    try {
        const reqDataUpdate = req.body
        const userId = req.user.id; // Assuming you have stored the user's ID in the token payload

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: {...reqDataUpdate, updated_at: new Date()}},
            {new: true}
        )
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'user data not found' });
            
        }

        res.status(201).json(updatedUser);
    } catch (error) {
        console.error('Update user account error:', error);
        res.status(500).json({ error: 'Update User Account Error' });
    }
}
