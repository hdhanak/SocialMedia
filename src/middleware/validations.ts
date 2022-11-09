import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "./commenResError";
const validator = require('./helper');


const register = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
        "firstName": "required|string",
        
        "email": "required_without:PhoneNo|string|email|exist:register,email",
        "password": "required|string|min:3|strict",
        "PhoneNo": "required_without:email|digits_between:10,10|exist:register,PhoneNo",//digits:10 not work
      

    };

    await validator(req.body, validationRule, {

        "required_without.email": 'email or phoneNo must required',
        "required_without.PhoneNo": 'email or phoneNo must required',
        digits_between: "phone number must be 10 digits"
    },

        (err: any, status: any) => {
            if (!status) {
                const tempObj = err.errors
                let transformed: any = {};
                Object.keys(tempObj).forEach(function (key, index) {
                    transformed[key] = tempObj[key]?.join('');
                })
                console.log(transformed, 'transformed');

                ErrorMessage(req, res, transformed, 422)

            } else {
                next();
            }
        }).catch((err: any) => console.log(err))
}
const login = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
        "firstName": "required|string",
        "email": "required_without:PhoneNo|string|email",
        "password": "required|string|min:3|strict",
        "PhoneNo": "required_without:email|digits_between:10,11"
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const CreatePost= async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "description": "required|string",
        "image": "required|array",
        "visibilty": "required|boolean",
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}

const likePost = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "postId": "required|string",
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const commentPost = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "postId": "required|string",
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "postId": "required|string",
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const sendInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        "postId": "required|string",
        "inviteeId": "required|string",
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
const changeInvitedStatus = async (req: Request, res: Response, next: NextFunction) => {
    const validationRule = {
       
        // "postId": "required|string",
        // "inviterId": "required|string",
        "status": "required|string|in:Active,Reject",
       
       
    }
    await validator(req.body, validationRule, { required_without: 'email or phoneNo must required', digits_between: "phone number must be 10 digits" }, (err: any, status: any) => {
        if (!status) {
            const tempObj = err.errors
            let transformed: any = {};
            Object.keys(tempObj).forEach(function (key, index) {
                transformed[key] = tempObj[key]?.join('');
            })
            console.log(transformed, 'transformed');


            ErrorMessage(req, res, transformed, 422)
        } else {
            next()
        }
    }).catch((e: any) => console.log(e))
}
export { register, login,CreatePost,commentPost,likePost,deletePost,sendInvitation ,changeInvitedStatus}