import Category from '../models/category.js'
import User from '../models/user.js'
import Hashtag from '../models/hashtag.js'
import Note from '../models/note.js'
import { validationResult } from 'express-validator'



export const createNote     //localhost:8080/note/create-note       method=POST
    = async (req, res, next) => {
        try {
            const error = validationResult(req)
            let creator;
            //console.log(req.userId)
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
                categoryExist.counter = categoryExist.counter + 1;

                await categoryExist.save()
                console.log(`Category with this title : ${categoryExist.title} exist so we dont need to inser new one!`)
            }

            else if (!categoryExist) {
                console.log('inserting new category....')
                const newCategory = new Category({ title: category, creator: req.userId })
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
                if (tags) {
                    const splited = tags.split(' ')

                    for (let i = 0; i < splited.length; i++) {
                        const p = splited[i]
                        const tagExist = await Hashtag.findOne({ title: p })
                        console.log(tagExist ? 'EXIST!' : 'Inserting..')
                        if (tagExist) {
                            tagExist.counter = tagExist.counter + 1;
                            await tagExist.save()
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
                }

                awaitedNote = await note.save()
                //console.log(awaitedNote)
                user.notes.push(awaitedNote._id)
                await user.save()
                return res.status(201).json({ note: awaitedNote, message: 'done' })

            }

            return main()







        } catch (err) {
            console.log(err)
            next(err)
        }


    }

export const getNote        //localhost:8080/note/get-note/id       method=GET
    = async (req, res, next) => {

        const noteId = req.params.noteId;

        try {
            const note = await Note.findById({ _id: noteId })

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
            console.log(note)
            res.status(200).json({ message: 'note fetched', note: note })
            return note;
        }
        catch (err) { next(err) }



    }


export const editNote       //localhost:8080/note/edit-note/id       method= PUT
    = async (req, res, next) => {
        const error = validationResult(req)
        const { tags, title, description, category } = req.body;
        if (!error.isEmpty()) {
            const error = new Error('invalid input')
            error.statusCode = 422;
            throw error;
        }
        const noteId = req.params.noteId;
        try {
            let category_ID;
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

            const noteCategory = await Category.findOne({_id:note.category});


            const categoryExist = await Category.findOne({ title: category })

            if (categoryExist) {
                if (categoryExist.title !== noteCategory.title) {
                    categoryExist.counter = categoryExist.counter + 1;
                    await categoryExist.save()

                    noteCategory.counter = noteCategory.counter - 1;
                    if(noteCategory.counter<0){
                        noteCategory.counter=0
                    }
                    await noteCategory.save()


                }

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

            const noteHashtagsArray = note.hashtags;
            const main = async () => {
                const splited = tags.split(' ')

                for (let i = 0; i < splited.length; i++) {

                    for (let j=0;j<noteHashtagsArray.length;j++)
                    {
                        const temp=noteHashtagsArray[j]
                        const p = splited[i]
                        const tagExist = await Hashtag.findOne({ title: p })
                        const OnenoteHashtag = await Hashtag.findOne({ _id: temp })

                        if (tagExist) {
                            if(OnenoteHashtag.title !== tagExist.title ){
                                OnenoteHashtag.counter=OnenoteHashtag.counter-1;
                                if(OnenoteHashtag.counter<0){
                                    OnenoteHashtag.counter=0;
                                }
                                await OnenoteHashtag.save()
                                tagExist.counter=tagExist.counter+1;
                                await tagExist.save();

                            }
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
                   

                }
                note.hashtags = temporary
                awaitedNote = await note.save()

                res.json({ note: awaitedNote })
            }

            main()






        } catch (err) { next(err) }
    }

export const deleteNote     //localhost:8080/note/delete-note/id       method= DELETE
    = async (req, res, next) => {
        const noteId = req.params.noteId;

        try {
            const user = await User.findById(req.userId);
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
            const category = await Category.findById(note.category)

            category.counter = category.counter - 1;

            if (category.counter < 0) {
                category.counter = 0
            }
            await category.save()

            const hashtagss = note.hashtags



            for (let i = 0; i < hashtagss.length; i++) {
                const p = hashtagss[i]
                const tagExist = await Hashtag.findOne({ _id: p })
                tagExist.counter = tagExist.counter - 1;
                if (tagExist.counter < 0) {
                    tagExist.counter = 0
                }
                await tagExist.save()

            }




            user.notes.pull(note._id);
            await user.save()
            const deleteNote = await Note.findByIdAndDelete(noteId)
            res.json({ message: 'delete note', deleteNote: deleteNote })

        }
        catch (err) { next(err) }




    }

export const fetchAll       //localhost:8080/note/get-notes?page=2&category=sport&sort=true&order=-1     method=GET
    = async (req, res, next) => {


        let page = req.query.page;
        const tags = req.body.tags
        console.log(tags)

        let TagsToSearch = [];
        if (tags) {
            console.log('there is tag spliting....')
            const splited = tags.split(' ')

            for (let i = 0; i < splited.length; i++) {
                const p = splited[i]
                const tagExist = await Hashtag.findOne({ title: p })
                if (tagExist) {
                    TagsToSearch.push(tagExist._id.toString())
                }

            }
        }

        console.log('this array        ', TagsToSearch)


        const cat = req.query.category
        const category = await Category.find({ title: cat })
        if (!category) {
            const error = new Error('we cant find this category, Please enter a valid one')
            error.statusCode = 404
            throw error
        }

        let forHashtag;
        let obj;

        if (tags) {
            obj = {
                creator: req.userId,
                hashtags: { $all: TagsToSearch },
                category: category

            }

        } else {
            obj = {
                creator: req.userId,
                category: category

            }


        }



        if (obj.creator === undefined) { delete obj.creator; }

        if (obj.category.length === 0) { delete obj.category; }

        console.log('this obj        ', obj)
        try {

            const PER_PAGE = 2;
            if (!page) {
                page = 1;
            }
            const countNotes = await Note.find(obj).countDocuments()

            let notes;
            if (req.query.sort) {

                console.log(req.query)
                console.log('bel if')
                notes = await Note.find(obj)
                    .sort({ updatedAt: req.query.order })
                    .skip((page - 1) * PER_PAGE)
                    .limit(PER_PAGE)



            } else {
                console.log('bel else')
                notes = await Note.find(obj)
                    .skip((page - 1) * PER_PAGE)
                    .limit(PER_PAGE)
            }

            console.log('note length is :', countNotes)
            if (notes.length === 0) {
                return res.status(404).json({ message: 'no notes to fetch' })
            }
            res.status(200).json({ note: notes, countNotes: countNotes })



        } catch (err) { next(err) }

    }
