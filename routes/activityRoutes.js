const express = require('express');
const router = express.Router();
const activity = require('../controllers/activity.controllers.js')


router.get('/', activity.getActivities);
router.get('/:id', activity.getActivity);
router.post('/', activity.addActivity);
router.put('/:id', activity.editActivity);
router.delete('/:id', activity.deleteActivity);


module.exports = router;