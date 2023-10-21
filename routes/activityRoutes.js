const express = require('express');
const router = express.Router();
const multer = require('multer')
const activity = require('../controllers/activity.controllers.js')
const auth = require('../middleware/authMiddleware')


// Multer middleware for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage
 });

router.get('/', auth, activity.getActivities);
router.get('/:id', auth, activity.getActivity);
router.post('/', auth, upload.single('image'), activity.addActivity);
router.put('/:id', auth, activity.editActivity);
router.delete('/:id', auth, activity.deleteActivity);


module.exports = router;