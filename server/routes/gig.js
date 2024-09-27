import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  searchGigs,
  getGigsByUserId,
  getCategories,
  searchGigsByCategory
} from "../controllers/gig.js";
import { verifyToken } from "../middleware/jwt.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";




const router = express.Router();

router.post("/",verifyToken, createGig); 
router.delete("/:id", deleteGig); 
router.get("/:id", getGig); 
router.get("/", getGigs);
router.get("/search/:query/:page", searchGigs);
router.get("/users/:userId", verifyToken, getGigsByUserId);
router.get("/categories", getCategories); 
router.get("/category/:category/:page", searchGigsByCategory); 

export default router;
