import Gig from "../models/Gig.js";
import User from "../models/User.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
    const user = await User.findById(req.body.userId);

    if (!user.isSeller)
        return next(createError(403, "Only sellers can create a gig!"));


  const newGig = new Gig({
      userId: req.body.userId,
      ...req.body,
  });
    try {
        const savedGig = await newGig.save();
        res.status(201).json(savedGig);
    } catch (err) {
        next(err);
    }
};

export const searchGigs = async (req, res, next) => {
    try {
        const { query, page = 1 } = req.params;

        const limit = 10;

        const searchQuery = {
            $text: { $search: query },
        };

        const gigs = await Gig.find(searchQuery)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalGigs = await Gig.countDocuments(searchQuery);

        res.status(200).json({
            total: totalGigs,
            page,
            limit,
            totalPages: Math.ceil(totalGigs / limit),
            results: gigs,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (gig.userId !== req.body.userId)
            return next(createError(403, "You can delete only your gig!"));

        await Gig.findByIdAndDelete(req.params.id);
        res.status(200).send("Gig has been deleted!");
    } catch (err) {
        next(err);
    }
};

export const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) next(createError(404, "Gig not found!"));
        res.status(200).send(gig);
    } catch (err) {
        next(err);
    }
};

export const getGigs = async (req, res) => {
    const gigs = await Gig.find().sort({ createdDate: -1 });

    res.status(200).send(gigs);
};

export const getGigsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const gigs = await Gig.find({ userId }).exec();

        res.status(200).json(gigs);
    } catch (err) {
        next(err);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Gig.distinct("category");
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
};

export const searchGigsByCategory = async (req, res, next) => {
    try {
        const { category, page } = req.params;

        const limit = 20;

        const gigs = await Gig.find({ category })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalGigs = await Gig.countDocuments({ category });

        res.status(200).json({
            total: totalGigs,
            page,
            limit,
            totalPages: Math.ceil(totalGigs / limit),
            results: gigs,
        });
    } catch (err) {
        next(err);
    }
};
