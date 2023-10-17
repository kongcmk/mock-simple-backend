const User = require("../models/user")


exports.getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});

        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"});
    }
}