import express, { Request, Response } from 'express'
const router = express.Router()
const V =require('../middleware/validations')
const path = require('path')
const multer = require('multer')
import { FileFilterCallback } from "multer";
import { changeInvitedStatus, commentPost, CreatePost, deletePost, getInvitation, imgUpload, likePost, login, postList, register, sendInvitation, unLikePost } from '../controller/logic'
import auth from '../middleware/auth'
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void


export var storage = multer.diskStorage({

    destination: function (req: Request, res: Response, callback: DestinationCallback) {
        console.log('1');

        callback(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req: Request, file: Express.Multer.File, callback: FileNameCallback) {
        console.log('file', file.originalname);

        callback(null, file.originalname)
    }
})

export const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}


router.post('/register',V.register,register)
router.post('/login',V.login,login)
router.post('/CreatePost',auth,V.CreatePost,CreatePost)
router.post('/imgUpload',imgUpload)
router.post('/likePost',V.likePost,auth,likePost)
router.post('/commentPost',V.commentPost,auth,commentPost)
router.get('/postList',postList),
router.post('/unLikePost',auth,unLikePost)
router.delete('/deletePost',V.deletePost,auth,deletePost)
router.post('/sendInvitation',V.sendInvitation,auth,sendInvitation)
router.get('/getInvitation',auth,getInvitation)
router.patch('/changeInvitedStatus/:postId',V.changeInvitedStatus,auth,changeInvitedStatus)
export default router
