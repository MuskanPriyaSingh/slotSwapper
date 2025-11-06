import express from 'express';
import { protect } from "../middlewares/authMiddleware.js";
import { swappableSlots, requestSlotSwap, getAllSwapRequest, respondSwapRequest } from '../controllers/swapControllers.js';

const router = express.Router();

// Swaps Routes
router.get("/swappable-slots", protect, swappableSlots);
router.post("/request", protect, requestSlotSwap);
router.get("/", protect, getAllSwapRequest);
router.put("/respond/:requestId", protect, respondSwapRequest);

export default router;