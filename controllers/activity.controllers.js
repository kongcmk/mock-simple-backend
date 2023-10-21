const Activity = require("../models/activity");
const User = require("../models/user");
const mongoose = require('mongoose');
// const cloudinary = require('cloudinary').v2;
const cloudinary = require('../configs/cloudinary.js');

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
  const fileImg = req.body.image && req.body.image.buffer; 

  try {
    // Check if request data and file are missing.
    if (!reqData) {
      return res.status(400).json({ error: "Activity data is missing" });
    }

    if (fileImg) {
      const result = await cloudinary.uploader.upload(fileImg, {
        upload_preset: 'activities_pic',
        public_id: req.user.id
      });

      // นำรูปภาพไปอัปโหลดขึ้น Cloudinary และใช้ URL จากการอัปโหลดใน newActivity
      const newActivity = new Activity({
        user: req.user.id,
        image_url: result.secure_url,
        ...reqData,
      });

      // ... รายละเอียดเพิ่มเติมของการสร้างกิจกรรมและการบันทึกลงในฐานข้อมูล
    } else {
      // ถ้าไม่มีรูปภาพถูกส่งมา
      const newActivity = new Activity({
        user: req.user.id,
        ...reqData,
      });

    // Validate the activity object.
    const validationError = newActivity.validateSync();

    if (validationError) {
      // Return the validation errors.
      const errors = Object.values(validationError.errors).map(
        (error) => error.message
      );

      return res.status(400).json({ error: errors });
    }

    // Save the new activity to the database.
    const savedActivity = await newActivity.save();

    // Add the new activity to the user's activities array.
    const user = await User.findById(req.user.id);

    user.activities.push(savedActivity._id);

    // Save the updated user object to the database.
    await user.save();

    // Return the saved activity object.
    res.status(201).json(savedActivity);
  }
  } catch (error) {
    // Log the error to the console.
    console.error(error);

    // Return an internal server error to the client.
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
