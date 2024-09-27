import Dispute from '../models/Dispute.js';
import Order from '../models/Order.js';

export const createDispute = async (req, res) => {
    const { description, orderId, raisedBy, buyerTestimony, sellerTestimony, buyerEvidence, sellerEvidence, comments, resolutionMethod } = req.body;
    try {
        const dispute = new Dispute({
            description,
            orderId,
            raisedBy,
            comments,
            resolutionMethod 
        });

        if (raisedBy === 'buyer') {
            dispute.buyerTestimony = buyerTestimony;
            dispute.buyerEvidence = buyerEvidence;
        } else if (raisedBy === 'seller') {
            dispute.sellerTestimony = sellerTestimony;
            dispute.sellerEvidence = sellerEvidence;
        }
        await dispute.save();
        res.status(201).json(dispute);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Upload proofs by the other party
export const submitCounter = async (req, res) => {
    const { id } = req.params; 
    const { testimony, evidence } = req.body;
    try {
        const dispute = await Dispute.findById(id);
        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        if (dispute.raisedBy === 'buyer') {
            dispute.sellerTestimony = testimony;
            dispute.sellerEvidence = evidence;
        } else if (dispute.raisedBy === 'seller') {
            dispute.buyerTestimony = testimony;
            dispute.buyerEvidence = evidence;
        }

        await dispute.save();
        res.json(dispute);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getDispute = async (req, res, next) => {
    try {
        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        const order = await Order.findById(dispute.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const disputeWithOrderDetails = {
            ...dispute.toObject(),
            orderDetails: {
                orderId: order._id,
                buyerId: order.buyerId,
                sellerId: order.sellerId
            }
        };

        res.json(disputeWithOrderDetails);
    } catch (error) {
        next(error);
    }
};

export const getAllDisputes = async (req, res, next) => {
    try {
        const disputes = await Dispute.find();
        const disputesWithOrderDetails = await Promise.all(
            disputes.map(async (dispute) => {
                const order = await Order.findById(dispute.orderId);
                if (order) {
                    return {
                        ...dispute.toObject(),
                        orderDetails: {
                            orderId: order._id,
                            buyerId: order.buyerId,
                            sellerId: order.sellerId
                        }
                    };
                }
                return dispute.toObject();
            })
        );

        res.json(disputesWithOrderDetails);
    } catch (error) {
        next(error);
    }
};

export const updateDispute = async (req, res, next) => {
    try {
        const updates = Object.keys(req.body);
        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }
        updates.forEach((update) => dispute[update] = req.body[update]);
        await dispute.save();
        res.json(dispute);
    } catch (error) {
        next(error);
    }
};

export const deleteDispute = async (req, res, next) => {
    try {
        const dispute = await Dispute.findByIdAndDelete(req.params.id);
        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }
        res.json(dispute);
    } catch (error) {
        next(error);
    }
};
