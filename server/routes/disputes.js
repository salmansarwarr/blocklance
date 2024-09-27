import express from 'express';
import { createDispute, getDispute, getAllDisputes, updateDispute, deleteDispute,submitCounter } from '../controllers/dispute.js';

const router = express.Router();

router.post('/', createDispute);
router.post('/counterproof/:id', submitCounter);
router.get('/:id', getDispute);
router.get('/', getAllDisputes);
router.put('/:id', updateDispute);
router.delete('/:id', deleteDispute);
export default router;
