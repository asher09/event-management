import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const createEvent = async (req: Request, res: Response) => {
  const { title, event_time, location, capacity } = req.body;

  if (typeof capacity !== 'number' || capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ error: 'Capacity must be a positive number and less than or equal to 1000.' });
  }

  try {
    const event = await prisma.events.create({
      data: {
        title,
        event_time: new Date(event_time),
        location,
        capacity,
      },
      select: { id: true },
    });
    return res.status(201).json({ id: event.id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create event.' });
  }
};

export const getEventDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await prisma.events.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    const registeredUsers = event.registrations.map((reg: any) => reg.user);
    return res.json({ ...event, registeredUsers });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch event details.' });
  }
};

export const registerForEvent = async (req: Request, res: Response) => {
  const { eventId, userId } = req.body;
  try {
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    if (new Date(event.event_time) < new Date()) {
      return res.status(400).json({ error: 'Cannot register for past events.' });
    }
    if (event.registrations.length >= event.capacity) {
      return res.status(400).json({ error: 'Event is full.' });
    }
    const existing = await prisma.registrations.findUnique({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });
    if (existing) {
      return res.status(400).json({ error: 'User already registered for this event.' });
    }
    await prisma.registrations.create({
      data: { user_id: userId, event_id: eventId },
    });
    return res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register for event.' });
  }
};

export const cancelRegistration = async (req: Request, res: Response) => {
  const { eventId, userId } = req.body;
  try {
    const registration = await prisma.registrations.findUnique({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });
    if (!registration) {
      return res.status(400).json({ error: "User wasn't registered for this event." });
    }
    await prisma.registrations.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });
    return res.json({ message: 'Registration cancelled.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to cancel registration.' });
  }
};

export const listUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    let events = await prisma.events.findMany({
      where: {
        event_time: { gt: now },
      },
      include: {
        registrations: true,
      },
    });
    events = events.sort((a, b) => {
      const dateDiff = new Date(a.event_time).getTime() - new Date(b.event_time).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.location.localeCompare(b.location);
    });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list upcoming events.' });
  }
};

export const eventStats = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    const totalRegistrations = event.registrations.length;
    const remainingCapacity = event.capacity - totalRegistrations;
    const percentUsed = event.capacity > 0 ? (totalRegistrations / event.capacity) * 100 : 0;
    return res.json({
      totalRegistrations,
      remainingCapacity,
      percentUsed: Number(percentUsed.toFixed(2)),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch event stats.' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  try {
    const user = await prisma.users.create({
      data: { name, email },
      select: { id: true, name: true, email: true },
    });
    return res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email must be unique.' });
    }
    return res.status(500).json({ error: 'Failed to create user.' });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({ select: { id: true, name: true, email: true } });
    return res.json(users);
  } catch {
    return res.status(500).json({ error: 'Failed to list users.' });
  }
};
