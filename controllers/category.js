import Category from '../models/category.js'
import User from '../models/user.js'
import Hashtag from '../models/hashtag.js'
import Note from '../models/note.js'
import { validationResult } from 'express-validator'


export const fetchCategories=async(req,res,next)=>{
    
    try{
        let page=req.query.page;
    console.log(page)
    const PER_PAGE=2;
    if(!page){
        page=1;
    }
    const countCategories=await Category.find().countDocuments() 
    
   const categories= await 
   Category.find()
   console.log(categories)
    // .sort({updatedAt:-1}) 
    // .skip((page-1)*PER_PAGE)
    // .limit(PER_PAGE)
if(!countCategories === 0){
    return res.status(404).json({message:'no categories to fetch'})
}
res.status(200).json({categories:categories,countcategories:countCategories})



    }catch(err){next(err)}





}