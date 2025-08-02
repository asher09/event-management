"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const router = (0, express_1.Router)();
// Create Event
router.post('/events', eventController_1.createEvent);
// Get Event Details
router.get('/events/:id', eventController_1.getEventDetails);
// Register for Event
router.post('/events/register', eventController_1.registerForEvent);
// Cancel Registration
router.post('/events/cancel', eventController_1.cancelRegistration);
// List Upcoming Events
router.get('/events', eventController_1.listUpcomingEvents);
// Event Stats
router.get('/events/:eventId/stats', eventController_1.eventStats);
// Create User
router.post('/users', eventController_1.createUser);
// List Users
router.get('/users', eventController_1.listUsers);
exports.default = router;
