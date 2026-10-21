import express from "express";
import { authmiddleware } from "../middleware/authMiddleware.js";
import { createTicket, getAllTicktes, getMyTickets, getTicketById, updateTicket, updateTicketStatus } from "../controller/ticketController.js";
import authorizeRoles from "../middleware/roleMiddleware.js";


const router = express.Router();
router.post("/", authmiddleware, createTicket)
router.get("/me", authmiddleware, getMyTickets);
router.patch("/:id", authmiddleware, updateTicket);
router.patch("/:id", authmiddleware, authorizeRoles("admin", "agent"), updateTicket)
router.get("/all", authmiddleware, authorizeRoles("agent", "admin"), getAllTicktes);
router.get("/:id", authmiddleware, getTicketById);
router.patch("/:id/status", authmiddleware, authorizeRoles("agent", "admin"), updateTicketStatus);

export default router;







