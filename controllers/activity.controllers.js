const Activity = require("../models/activity")

// All activities
exports.getActivities = async (req, res) => {
    try {
        const allActivities = await Activity.find({});
        res.status(200).json(allActivities);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error" })
    }
};

//Single activity
exports.getActivity = async (req, res) => {
    const {id} = req.params
    try {
        const activityData = await Activity.findById(id);

        if (!activityData) {
            res.status(404).json({error: "Activity not found"});
        }

        res.status(200).json(activityData);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"})
    }
};

//create activity
exports.addActivity = async (req, res) => {
    const reqData = req.body
    try {
        if (!reqData) {
            return res.status(400).json({error: "Activity data is missing"});
            
        }

        const newActivity = new Activity(reqData);

        const validationError = newActivity.validateSync();

        if(validationError) {
            const errors = Object.values(validationError.errors).map((error) => error.message)
            return res.status(400).json({error: errors});
        }

        const savedActivity = await newActivity.save();

        res.status(201).json(savedActivity);
    } catch (error) {
        console.error(error)
        res.status(500).json({error : "Internal Server Error"})
    }
}

// Update activity
exports.editActivity = async (req, res) => {
   
    try {
        const reqId = req.params.id
        const reqDataUpdate = req.body
        const updatedActivity = await Activity.findByIdAndUpdate(
            reqId, 
            { $set: { ...reqDataUpdate, updated_at: new Date() } },
            {new: true}
        )
        
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json(updatedActivity)
    } catch (error) {
        console.error(error)
        res.status(500).json({error : "Internal Server Error"})
    }
}

exports.deleteActivity = async (req, res) => {
    try {
        const reqId = req.params.id
        const item = await Activity.findById(reqId)
        const deletedItem = await Activity.findByIdAndDelete(reqId)
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json({ message: `ID: ${reqId} with Title: "${item.title}" has been deleted successfully` });
    } catch (error) {
        console.error(error)
        res.status(500).json({error : "Internal Server Error"})
    }
}