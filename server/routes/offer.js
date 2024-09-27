import express from 'express';
import { createOffer, getOffer, getAllOffers, updateOffer, deleteOffer, getOfferByBuyerAndSeller, getOfferByUser } from '../controllers/offer.js';

const router = express.Router();

router.post('/', createOffer);
router.get('/:id', getOffer);
router.get('/', getAllOffers);
router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);
router.get('/user/:userId', getOfferByUser)
router.get('/buyer/:buyerId/seller/:sellerId', getOfferByBuyerAndSeller);

export default router;
