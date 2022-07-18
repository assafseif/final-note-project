import Category from '../models/category.js'
import User from '../models/user.js'
import Hashtag from '../models/hashtag.js'
import Note from '../models/note.js'
import { validationResult } from 'express-validator'



export const createNote = async (req, res, next) => {
    try {
        const error = validationResult(req)
        let creator;
        if (!error.isEmpty()) {
            const error = new Error('invalid input')
            error.statusCode = 422;
            throw error;
        }
        const user = await User.findOne({ _id: req.userId })

        if (!user) {
            const error = new Error('no user found')
            error.statusCode = 404;
            throw error;

        }
        let category_ID;
        const { tags, title, description, category } = req.body;
        console.log(category)
        const categoryExist = await Category.findOne({ title: category })

        if (categoryExist) {
            category_ID = categoryExist._id
            console.log(`Category with this title : ${categoryExist.title} exist so we dont need to inser new one!`)
        }

        else if (!categoryExist) {
            console.log('inserting new category....')
            const newCategory = new Category({ title: category })
            const awaitedcategory = await newCategory.save()
            category_ID = awaitedcategory._id
        }
        console.log(category_ID)

        const note = new Note({
            title: title,
            description: description,
            creator: req.userId,
            category: category_ID,
            hashtags: []

        })

        let awaitedNote;

        const main = async () => {
            const splited = tags.split(' ')

            for (let i = 0; i < splited.length; i++) {
                const p = splited[i]
                const tagExist = await Hashtag.findOne({ title: p })
                console.log(tagExist ? 'EXIST!' : 'Inserting..')
                if (tagExist) {
                    //console.log(` ${tagExist.title} exist so we dont need to insert new one`)
                    note.hashtags.push(tagExist._id)

                }
                else
                    if (!tagExist) {
                        const hashtags = new Hashtag({
                            title: p
                        })

                        let awaitedTags = await hashtags.save()
                        note.hashtags.push(awaitedTags._id)


                    }

            }

            awaitedNote = await note.save()
            //console.log(awaitedNote)
            user.notes.push(awaitedNote._id)
            await user.save()
            res.json({ note: awaitedNote })
        }

        main()










    } catch (err) { next(err) }


}

export const getNote = async (req, res, next) => {

    const noteId = req.params.noteId;
    console.log(noteId)
    try {
        const note = await Note.findById({ _id: noteId })
        console.log(note)
        if (!note) {
            const error = new Error('there no Note with this Id')
            error.statusCode = 404;
            throw error

        }
        if (note.creator.toString() !== req.userId) {
            console.log(note.creator.toString(), req.userId)
            const error = new Error('you are not athenticated to here')
            error.statusCode = 401;
            throw error
        }

        res.json({ message: 'note fetched', note: note })

    }
    catch (err) { next(err) }



}


export const editNote = async (req, res, next) => {
    const error = validationResult(req)
    const { tags, title, description, category } = req.body;
    if (!error.isEmpty()) {
        const error = new Error('invalid input')
        error.statusCode = 422;
        throw error;
    }
    const noteId = req.params.noteId;
    try {
        const note = await Note.findById({ _id: noteId })
        console.log(note)
        if (!note) {
            const error = new Error('there no Note with this Id')
            error.statusCode = 404;
            throw error

        }
        if (note.creator.toString() !== req.userId) {
            console.log(note.creator.toString(), req.userId)
            const error = new Error('you are not athenticated to here')
            error.statusCode = 401;
            throw error
        }
        note.title = title;
        note.description = description;
        let category_ID;
        const categoryExist = await Category.findOne({ title: category })

        if (categoryExist) {
            category_ID = categoryExist._id
            console.log(`Category with this title : ${categoryExist.title} exist so we dont need to inser new one!`)
        }

        else if (!categoryExist) {
            console.log('inserting new category....')
            const newCategory = new Category({ title: category })
            const awaitedcategory = await newCategory.save()
            category_ID = awaitedcategory._id
        }
        note.category = category_ID;


        let awaitedNote;
        let temporary = [];
        const main = async () => {
            const splited = tags.split(' ')

            for (let i = 0; i < splited.length; i++) {
                const p = splited[i]
                const tagExist = await Hashtag.findOne({ title: p })
                console.log(tagExist ? 'EXIST!' : 'Inserting..')
                if (tagExist) {
                    //console.log(` ${tagExist.title} exist so we dont need to insert new one`)
                    temporary.push(tagExist._id)

                }
                else
                    if (!tagExist) {
                        const hashtags = new Hashtag({
                            title: p
                        })

                        let awaitedTags = await hashtags.save()
                        temporary.push(awaitedTags._id)


                    }

            }
            note.hashtags = temporary
            awaitedNote = await note.save()

            res.json({ note: awaitedNote })
        }

        main()






    } catch (err) { next(err) }
}

export const deleteNote = async (req, res, next) => {
    const noteId = req.params.noteId;
    //console.log(noteId)
    try {
        const note = await Note.findById({ _id: noteId })

        if (!note) {
            const error = new Error('there no Note to delete')
            error.statusCode = 404;
            throw error

        }
        if (note.creator.toString() !== req.userId) {
            console.log(note.creator.toString(), req.userId)
            const error = new Error('you are not athenticated to here')
            error.statusCode = 401;
            throw error
        }
        const deleteNote = await Note.findByIdAndDelete(noteId)
        res.json({ message: 'delete note', deleteNote: deleteNote })

    }
    catch (err) { next(err) }




}

export const fetchAll = async (req, res, next) => {
    //get-notes?tag=guitar&page=2&category=sport&sort=true&order=-1

    const tagid = req.query.tag
    let tagId;
    if(tagid){
      
     const awaitedtag =await Hashtag.findOne({title:tagid})
     tagId=awaitedtag._id;

    }

    console.log(tagId)
    const cat = req.query.category
    const category = await Category.find({ title: cat })


    let page = req.query.page;
    const obj = {
        creator: req.userId,
        hashtags: tagId,
        category: category

    }

    if (obj.creator === undefined) { delete obj.creator; }

    if (obj.hashtags === undefined) { delete obj.hashtags; }
    if (obj.category.length === 0) { delete obj.category; }

    console.log(obj)
    try {

        const PER_PAGE = 2;
        if (!page) {
            page = 1;
        }
        const countNotes = await Note.find(obj).countDocuments()

       //localhost:8080/note/get-notes/62d580729be05ed1c0b0a004?page=1&category=sport&sort=true&order=-1
        let notes;
        if (req.query.sort) {

            notes = await Note.find(obj)
                .sort({ updatedAt: req.query.order })
                .skip((page - 1) * PER_PAGE)
                .limit(PER_PAGE)



        } else {
            notes = await Note.find(obj)
            .skip((page - 1) * PER_PAGE)
            .limit(PER_PAGE)
        }

        console.log('note length is :', notes.length)
        if (notes.length === 0) {
            return res.status(404).json({ message: 'no notes to fetch' })
        }
        res.status(200).json({ note: notes, countNotes: countNotes })



    } catch (err) { next(err) }

}
