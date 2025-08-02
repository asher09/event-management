import { Router } from 'express';
import {
  createEvent,
  getEventDetails,
  registerForEvent,
  cancelRegistration,
  listUpcomingEvents,
  eventStats,
  createUser,
  listUsers
} from '../controllers/eventController';

const router = Router();

// Create Event
router.post('/events', createEvent);

// Get Event Details
router.get('/events/:id', getEventDetails);

// Register for Event
router.post('/events/register', registerForEvent);

// Cancel Registration
router.post('/events/cancel', cancelRegistration);

// List Upcoming Events
router.get('/events', listUpcomingEvents);

// Event Stats
router.get('/events/:eventId/stats', eventStats);

// Create User
router.post('/users', createUser);

// List Users
router.get('/users', listUsers);

export default router;
