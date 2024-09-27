import Category from "../models/Category";
import Gig from "../models/Gig";


export const createCategory = async(req,res,next)=>{

    try {
        const {name,description}=req.body;
        const newCategory = new Category({name,description})
        await newCategory.save()
        res.status(201).json(newCategory)
    } catch (error) {
        next(error);

        
    }
}


export const getGigsByCategory = async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const gigs = await Gig.find({ category: categoryId }).exec();
      res.json(gigs);
    } catch (error) {
      next(error);
    }
  };   