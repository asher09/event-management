"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.createUser = exports.eventStats = exports.listUpcomingEvents = exports.cancelRegistration = exports.registerForEvent = exports.getEventDetails = exports.createEvent = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, event_time, location, capacity } = req.body;
    if (typeof capacity !== 'number' || capacity <= 0 || capacity > 1000) {
        return res.status(400).json({ error: 'Capacity must be a positive number and less than or equal to 1000.' });
    }
    try {
        const event = yield prisma.events.create({
            data: {
                title,
                event_time: new Date(event_time),
                location,
                capacity,
            },
            select: { id: true },
        });
        return res.status(201).json({ id: event.id });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to create event.' });
    }
});
exports.createEvent = createEvent;
const getEventDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield prisma.events.findUnique({
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
        const registeredUsers = event.registrations.map((reg) => reg.user);
        return res.json(Object.assign(Object.assign({}, event), { registeredUsers }));
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch event details.' });
    }
});
exports.getEventDetails = getEventDetails;
const registerForEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, userId } = req.body;
    try {
        const event = yield prisma.events.findUnique({
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
        const existing = yield prisma.registrations.findUnique({
            where: { user_id_event_id: { user_id: userId, event_id: eventId } },
        });
        if (existing) {
            return res.status(400).json({ error: 'User already registered for this event.' });
        }
        yield prisma.registrations.create({
            data: { user_id: userId, event_id: eventId },
        });
        return res.status(201).json({ message: 'Registration successful.' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to register for event.' });
    }
});
exports.registerForEvent = registerForEvent;
const cancelRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, userId } = req.body;
    try {
        const registration = yield prisma.registrations.findUnique({
            where: { user_id_event_id: { user_id: userId, event_id: eventId } },
        });
        if (!registration) {
            return res.status(400).json({ error: "User wasn't registered for this event." });
        }
        yield prisma.registrations.delete({
            where: { user_id_event_id: { user_id: userId, event_id: eventId } },
        });
        return res.json({ message: 'Registration cancelled.' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to cancel registration.' });
    }
});
exports.cancelRegistration = cancelRegistration;
const listUpcomingEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        let events = yield prisma.events.findMany({
            where: {
                event_time: { gt: now },
            },
            include: {
                registrations: true,
            },
        });
        events = events.sort((a, b) => {
            const dateDiff = new Date(a.event_time).getTime() - new Date(b.event_time).getTime();
            if (dateDiff !== 0)
                return dateDiff;
            return a.location.localeCompare(b.location);
        });
        return res.json(events);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to list upcoming events.' });
    }
});
exports.listUpcomingEvents = listUpcomingEvents;
const eventStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        const event = yield prisma.events.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch event stats.' });
    }
});
exports.eventStats = eventStats;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }
    try {
        const user = yield prisma.users.create({
            data: { name, email },
            select: { id: true, name: true, email: true },
        });
        return res.status(201).json(user);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email must be unique.' });
        }
        return res.status(500).json({ error: 'Failed to create user.' });
    }
});
exports.createUser = createUser;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany({ select: { id: true, name: true, email: true } });
        return res.json(users);
    }
    catch (_a) {
        return res.status(500).json({ error: 'Failed to list users.' });
    }
});
exports.listUsers = listUsers;
