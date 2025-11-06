import { Event } from '../models/Event.js';
import { SwapRequest } from '../models/SwapRequest.js';

// Get all swappable slots (except user's own)
export const swappableSlots = async (req, res) => {
    try {
        const slots = await Event.find({ 
            status: 'SWAPPABLE',
            owner: { $ne: req.userId } 
        }).populate('owner', 'name email');
        res.status(200).json({
            success: true,
            message: "Fetched all swappable slots",
            slots
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            error: "Failed fetch swappable slots" 
        });
    }
};

// Request a slot swap
export const requestSlotSwap = async (req, res) => {
    try {
        const { mySlotId, theirSlotId } = req.body;

        const mySlot = await Event.findById(mySlotId);
        const theirSlot = await Event.findById(theirSlotId);

        if (!mySlot || !theirSlot) {
            return res.status(404).json({
                success: false, 
                message: 'Slot not found' 
            });
        }

        if (mySlot.owner.toString() === theirSlot.owner.toString()) {
            return res.status(400).json({ 
                success: false,
                message: 'Cannot swap your own slots' 
            });
        }

        // Create new swap request
        const swap = await SwapRequest.create({
            requester: req.userId,
            responder: theirSlot.owner,
            mySlot: mySlotId,
            theirSlot: theirSlotId,
            status: 'PENDING',
        });

        mySlot.status = 'SWAP_PENDING';
        theirSlot.status = 'SWAP_PENDING';
        await mySlot.save();
        await theirSlot.save();

        res.status(200).json({ 
            success: true,
            message: 'Swap request sent', 
            swap 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            error: "Failed to sent swap request"
        });
    }
};

// View all swap requests (incoming/outgoing)
export const getAllSwapRequest = async (req, res) => {
    try {
        const swaps = await SwapRequest.find({
            $or: [{ requester: req.userId }, { responder: req.userId }]
        })
        .populate('mySlot theirSlot requester responder', 'title startTime endTime name email');

        res.status(200).json({
            success: true,
            message: "Fetch all swap requests successfully",
            swaps
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch all swap requests" 
        });
    }
};

// Respond to a swap (accept/reject)
export const respondSwapRequest = async (req, res) => {
    const { decision } = req.body; // ACCEPTED or REJECTED
    const { requestId } = req.params;

    try {
        const swap = await SwapRequest.findById(requestId)
        .populate('mySlot theirSlot');

        if (!swap) {
            return res.status(404).json({
                success: false,
                message: 'Swap not found' 
            });
        }

        if (swap.responder.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized' 
            });
        }

        if (decision === 'ACCEPTED') {
            // Swap the owners of the two events
            const tempOwner = swap.mySlot.owner;
            swap.mySlot.owner = swap.theirSlot.owner;
            swap.theirSlot.owner = tempOwner;

            swap.mySlot.status = 'BUSY';
            swap.theirSlot.status = 'BUSY';
            swap.status = 'ACCEPTED';

            await swap.mySlot.save();
            await swap.theirSlot.save();
            await swap.save();
        } else {
            swap.status = 'REJECTED';
            await swap.save();

            swap.mySlot.status = 'SWAPPABLE';
            swap.theirSlot.status = 'SWAPPABLE';
            await swap.mySlot.save();
            await swap.theirSlot.save();
        }

        res.status(200).json({ 
            success: true,
            message: `Swap ${decision}`, 
            swap 
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};