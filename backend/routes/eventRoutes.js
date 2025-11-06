import express from "express";
import { deleteEvent, getEventById, getEvents } from "../controllers/eventControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createEvent, updateEvent } from "../controllers/eventControllers.js";

const router = express.Router();

// Event Routes
router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById)
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;