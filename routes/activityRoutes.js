const express = require('express');
const router = express.Router();
const activity = require('../controllers/activity.controllers.js')
const auth = require('../middleware/authMiddleware')

router.get('/', auth, activity.getActivities);
router.get('/:id', auth, activity.getActivity);
router.post('/', auth, activity.addActivity);
router.put('/:id', auth, activity.editActivity);
router.delete('/:id', auth, activity.deleteActivity);


module.exports = router;