import createError from "../utils/createError.js";
import Order from "../models/Order.js";
import Gig from "../models/Gig.js";

export const createOrder = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (req.body.isPaid) {
            const newOrder = new Order({
                gigId: gig._id,
                title: req.body.title,
                buyerId: req.body.buyerId,
                sellerId: req.body.sellerId,
                price: req.body.price,
                contractAddress: req.body.contractAddress,
                deadline: req.body.deadline
            }); 

            await newOrder.save();

            res.status(200).send({
                newOrder,
                message: "Order Created Successfully",
            });
        } else {
            res.status(500).send({ message: "Order Failed" });
        }
    } catch (err) {
        next(err);
    }
};

    export const getOrders = async (req, res, next) => {
        try {
            const { sellerId } = req.params;

            const orders = await Order.find({ sellerId: sellerId });
            res.status(200).send(orders);
        } catch (err) {
            next(err);
        }
    };

export const getOrdersByBuyer = async (req, res, next) => {
    try {
        
        const { buyerId } = req.params;


        const orders = await Order.find({buyerId:buyerId}).exec();
        res.status(200).send(orders);
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            throw createError(404, "Order not found");
        }

        order.status = status;
        order = await order.save();

        res.status(200).send({
            message: "Order status updated successfully",
            order,
        });
    } catch (err) {
        next(err);
    }
};

export const getOrdersByGig = async (req, res, next) => {
    try {
        const orders = await Order.find({
            gigId: req.params.gigid,
            isCompleted: true,
        });

        res.status(200).send(orders);
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            throw createError(404, "Order not found");
        }

        res.status(200).send(order);
    } catch (err) {
        next(err);
    }
};
