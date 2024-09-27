import express from 'express';
import { saveMessage, getAllMessages } from '../controllers/message.js';

const router = express.Router();

router.post('/', saveMessage);

router.get('/:userId/:senderId', getAllMessages);

export default router;
    

