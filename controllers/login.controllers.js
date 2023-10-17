const bcrypt = require('bcrypt');
const User = require("../models/user.js");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Username not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            user.last_login = new Date();

            await user.save();

            res.json({
                message: "Login successfully"
            });
        } else {
            res.status(401).json({ error: "Username or password is incorrect" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login Error" });
    }
}
