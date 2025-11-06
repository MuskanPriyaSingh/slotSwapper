import { Event } from '../models/Event.js';

// Get user events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ owner: req.userId});
        res.status(200).json({
            success: true, 
            message: "All events are fetched Successfully", 
            events 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            error: "Error fetching all events" 
        });
    }
};

// Get a event by id
export const getEventById = async (req, res) => {
   try {
        const event = await Event.findById(req.params.id);

        res.status(200).json({
            success: true, 
            message: "Event fetched Successfully", 
            event 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            error: "Error fetching event by id" 
        });
    } 
}

// Create new event 
export const createEvent = async (req, res) => {
    const { title, startTime, endTime, status } = req.body;

    try {
        const event = await Event.create({ 
            title, 
            startTime, 
            endTime,
            status, 
            owner: req.userId 
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            error: "Error creating event"
        });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false, 
                message: 'Event not found' 
            });
        }

        if (event.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized' 
            });
        }

        Object.assign(event, req.body);
        await event.save();

        res.status(202).json({
            success: true,
            message: "Event updated successfully",
            event
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            error: "Error while updating event" 
        });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    const ownerId = req.userId;
    const eventId = req.params.id;

    try {
        const event = await Event.findOne({
            _id: eventId,
            owner: ownerId,
        });

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                error: "Cannot delete the event, created by other user"
            });
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Error in deleting event"
        });
    }
}