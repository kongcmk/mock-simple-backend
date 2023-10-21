const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = require("../routes/loginRoutes");

//GET users listing
exports.getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});

    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//GET user profile
exports.getUser = async (req, res, next) => {
  const userID = req.user.id;
  try {
    const user = await User.findById(userID);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//PUT user
exports.editUser = async (req, res, next) => {
  try {
    const reqDataUpdate = req.body;
    const userId = req.user.id; // Assuming you have stored the user's ID in the token payload

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { ...reqDataUpdate, updated_at: new Date() } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "user data not found" });
    }

    // Define the schema order
    res
      .status(201)
      .json({ message: "User data updated successfully", updatedUser });
  } catch (error) {
    console.error("Update user account error:", error);
    res.status(500).json({ error: "Update User Account Error" });
  }
};

//PUT new password
exports.editPassword = async (req, res, next) => {
  try {
    const reqDataUpdate = req.body;
    const userId = req.user.id; // Assuming you have stored the user's ID in the token payload
    const currentPassword = reqDataUpdate.currentPassword;
    const newPassword = reqDataUpdate.newPassword;
    const renewPassword = reqDataUpdate.renewPassword;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User data not found" });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // Check if the new password and renew password match
    if (newPassword !== renewPassword) {
      return res
        .status(400)
        .json({ message: "New password and renew password do not match" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and set the updated_at field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedNewPassword,
          updated_at: new Date(),
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Password update error" });
  }
};

//PUT deactivated account
exports.deactivatedUser = async (req, res) => {
  const userId = req.user.id;
  const reqConfirmToDeactivated = req.body.confirmDeactivated;
  try {
    if (reqConfirmToDeactivated !== "delete account") {
      return res
        .status(400)
        .json({
          message: "Confirmation is incorrect. Account was not deleted.",
        });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          deactivated: true,
          updated_at: new Date(),
        },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({
          message: `User with ID ${userId} not found. Account was not deleted.`,
        });
    }

    res
      .status(201)
      .json({ message: `Account ID: ${userId} was deleted successfully` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the account." });
  }
};
