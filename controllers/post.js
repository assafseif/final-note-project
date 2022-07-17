import mongoose from "mongoose"
import User from '../models/user.js'
import Post from '../models/post.js'
import user from "../models/user.js";
import fs from 'fs'

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createpost = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const user = await User.findOne({ _id: req.userId })
    if(!req.file){
        console.log(req.file)
        const error = new Error('no picture to add')
        error.statusCode=404;
        throw error;
    }
    const imageUrl=req.file.path

    console.log(user)
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    })

    const awaitedpost = await post.save();
    user.posts.push(awaitedpost);
    await user.save()
    res.status(200).json({
        message: "post added",
        post: awaitedpost
    })


}


export const deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    console.log(req.userId);



    try {
        const user = await User.findOne({ _id: req.userId })
        const post = await Post.findOne({ _id: postId })
        if (!post) {
            const error = new Error('no post to delete ')
            error.statusCode = 404;
            throw error
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error(' you are not the owener of this post')
            error.statusCode = 401;
            throw error;
        }
        console.log(post.imageUrl)
        const filePath =  path.resolve(__dirname, '..', post.imageUrl);
        console.log(filePath)
        fs.unlink(filePath, err => console.log(err))
      
        const deletedpost = await Post.findByIdAndRemove(postId);
        
        user.posts.pull(postId)
        await user.save()
        res.status(200).json({ message: "deleted", deletedpost: deletedpost })

        

    } catch (err) { next(err) }


}

export const getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById({ _id: postId });
        if (!post) {
            const error = new Error('no post found')
            error.statusCode = 404;
            throw 404;
        }
        if (post.creator.toString() !== req.userId) {
            console.log(post.creator.toString(),req.userId)
            const error = new Error('you are not the owner of this post')
            error.statusCode = 403;
            throw error;
        }
        res.status(200).json({ 
            message: 'post fetched',
            post:post
        })

    } catch (err) { next(err) }





}



export const fetchAll=async(req,res,next)=>{
    let page=req.query.page;
    console.log(page)
    if(!page){
        page=1;
    }
    const PER_PAGE=2;
    const user=await User.findById(req.userId);
    try{
        
        const posts=await Post.find().skip((page-1)*PER_PAGE).limit(PER_PAGE)
        res.json({posts:posts})

    }
    catch(err){next(err)}



}