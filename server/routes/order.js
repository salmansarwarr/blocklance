import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, getOrdersByGig, getOrder, createOrder, getOrdersByBuyer } from "../controllers/order.js";

const router = express.Router();

router.get("/seller/:sellerId", getOrders);
router.get("/buyer/:buyerId",verifyToken, getOrdersByBuyer);
router.get("/gig/:gigid", verifyToken, getOrdersByGig);
router.get("/:orderId", verifyToken, getOrder);
router.post("/createOrder/:id", createOrder);

export default router;
