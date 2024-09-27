import Offer from "../models/Offer.js";

export const createOffer = async (req, res) => {
    const { buyerId, sellerId, description, price, deliveryDate } = req.body;
    try {
        const offer = new Offer({
            buyerId,
            sellerId,
            description,
            price,
            deliveryDate,
        });
        await offer.save();
        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



  export const getOffersByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        
        const offers = await Offer.find({ $or: [{ buyerId: userId }, { sellerId: userId }] });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

export const getOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOffer = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        updates.forEach((update) => (offer[update] = req.body[update]));
        await offer.save();
        res.json(offer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOfferByBuyerAndSeller = async (req, res) => {
    const { buyerId, sellerId } = req.params;
    try {
        const offer = await Offer.findOne({ buyerId, sellerId });
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOfferByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const offer = await Offer.find({
            $or: [{ buyerId: userId }, { sellerId: userId }],
        });
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
