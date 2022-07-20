import Category from '../models/category.js'
import User from '../models/user.js'
import Hashtag from '../models/hashtag.js'
import Note from '../models/note.js'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'

export const fetchCategories //localhost:8080/category/get-categories   method=GET
    = async (req, res, next) => {

        try {
            let page = req.query.page;

            const PER_PAGE = 2;
            if (!page) {
                page = 1;
            }
            const countCategories = await Category.find().countDocuments()

            const categories = await
                Category.find()
                    .skip((page - 1) * PER_PAGE)
                    .limit(PER_PAGE)
            if (!countCategories === 0) {
                return res.status(404).json({ message: 'no categories to fetch' })
            }
            res.status(200).json({ categories: categories, countcategories: countCategories })



        } catch (err) { next(err) }





    }
export const fetchCategory  //localhost:8080/category/get-category/id   method=get
    = async (req, res, next) => {
        try {

            const categoryid = req.params.categoryid;

            //const note =await Note.findOne({creator:req.userId})
            const category = await Category.findOne({ _id: categoryid })

            if (!category) {
                const error = new Error('no category to fecth')
                error.statusCode = 404;
                throw error
            }
            res.status(200).json({ message: 'category fetched', category: category })




        } catch (err) { next(err) }
    }




export const createCategory //localhost:8080/category/add-category      method=post
    = async (req, res, next) => {
        try {
            const error = validationResult(req)

            if (!error.isEmpty()) {
                const error = new Error('invalid input')
                error.statusCode = 422;
                throw error;
            }
            const category = req.body.category;
            const fetchedCategory = await Category.findOne({ title: category })
            const user = await User.findById(req.userId)
            if (!user) {
                const error = new Error('something went wrong')
                error.statusCode = 404
                throw error
            }
            if (!fetchedCategory) {
                console.log('inserting new category....')
                const newcategory = new Category({
                    title: category,
                    creator: req.userId
                })
                const awaitedcategory = await newcategory.save()
                res.status(201).json({ message: 'new category created!', category: awaitedcategory })
                return awaitedcategory
            }
            res.status(409).json({ message: "this category is already exist" })
        }

        catch (err) { next(err) }



    }



export const editCategory   //localhost:8080/category/edit-category/id   method=PUT
    = async (req, res, next) => {
        const categoryId = req.params.categoryid;
        const newCategory = req.body.category;
        const error = validationResult(req)
        if (!error.isEmpty()) {
            const error = new Error('invalid input')
            error.statusCode = 422;
            throw error;
        }

        try {
            const category = await Category.findById(categoryId);
            
            if (!category) {
                const error = new Error('we cannot find category with this id')
                error.statusCode = 404;
                throw error;
            }
            if (req.userId !== category.creator.toString()) {
                const error = new Error('Unauthorized')
                error.statusCode = 401;
                throw error;
            }



            const categoryExist = await Category.findOne({ title: newCategory })
            if (categoryExist) {
                const error = new Error(`you Cannot update your category if the same title exist
          ,because it exist so you should update by a new title`)
                error.statusCode = 406;
                throw error;


            }





            // console.log('inserting a new category')
            category.title = newCategory;
            const awaitedCategory = await category.save()
            res.status(201).json({ message: 'editing done!', category: awaitedCategory })


        }
        catch (err) { next(err) }


    }



export const deleteCategory //localhost:8080/category/delete-category/id    method=DELETE
    = async (req, res, next) => {
        const categoryId = req.params.categoryid;
        try {
            const category = await Category.findById(categoryId);

            if (!category) {
                const error = new Error('we cannot find category with this id')
                error.statusCode = 404;
                throw error;
            }
            if (req.userId !== category.creator.toString()) {
                console.log('error')
                const error = new Error('Unauthorized')
                error.statusCode = 401;
                throw error;
            }

            const notes = await Note.find({ creator: req.userId, category })



            if (notes.length > 0) {

                for (let i = 0; i < notes.length; i++) {
                    const note = notes[i]
                    if (note.category) {

                        const error = new Error('we cannot delete category if it exist in a note')
                        error.statusCode = 405;
                        throw error
                    }
                }
            }
            

            const awaiteddelete = await Category.findByIdAndDelete(categoryId)
            res.status(200).json({ awaiteddelete: awaiteddelete })
            return awaiteddelete


            ///////////////////////////////// 2nd option if you want to delete category and delete field in note
            //   const notes = await Note.find({ creator: req.userId, category })
            // const CategoryIdObjectId = mongoose.Types.ObjectId(categoryId);

          


            //         for (let i = 0; i < notes.length; i++) {
            //             const note = notes[i]
            //             console.log(CategoryIdObjectId)
            //             await Note.updateOne({_id: note._id}, {$unset: {category: 1 }});
            //         }

            //         const awaiteddelete=await Category.findByIdAndDelete(categoryId)
            //         res.json({ awaiteddelete: awaiteddelete})
            //     }

            



        } catch (err) { next(err) }




    }