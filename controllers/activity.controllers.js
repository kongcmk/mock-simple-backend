const Activity = require("../models/activity");
const User = require("../models/user");
const mongoose = require('mongoose');

// All activities by User
exports.getActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('activities');
    allActivitiesByUser = user.activities

    res.status(200).json(allActivitiesByUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Single activity
exports.getActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activityData = await Activity.findById({
      _id: id,
      user: req.user.id,
    });

    if (!activityData) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activityData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//create activity
exports.addActivity = async (req, res) => {
  const reqData = req.body;
  try {
    if (!reqData) {
      return res.status(400).json({ error: "Activity data is missing" });
    }

    const newActivity = new Activity({
        user: req.user.id,
        ...reqData,
      });

    const validationError = newActivity.validateSync();

    if (validationError) {
      const errors = Object.values(validationError.errors).map(
        (error) => error.message
      );

      return res.status(400).json({ error: errors });
    }
    const savedActivity = await newActivity.save();

    const user = await User.findById(req.user.id);

    user.activities.push(newActivity._id);
    await user.save();

    res.status(201).json(savedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update activity
exports.editActivity = async (req, res) => {
  try {
    const reqId = req.params.id;
    const reqDataUpdate = req.body;
    const updatedActivity = await Activity.findByIdAndUpdate(
      { _id: reqId, user: req.user.id },
      { $set: { ...reqDataUpdate, updated_at: new Date() } },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const reqId = req.params.id;
    const item = await Activity.findById(reqId);
    
    const deletedItem = await Activity.findByIdAndDelete({
      _id: reqId,
      user: req.user.id,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(reqId)) {
    return res.status(400).json({ message: "Invalid ID" });
    }
    const user = await User.findById(req.user.id);
    
    user.activities.pull(reqId);
    await user.save();

    res
      .status(200)
      .json({
        message: `ID: ${reqId} with Title: "${item.title}" has been deleted successfully`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
