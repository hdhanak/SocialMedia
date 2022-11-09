import { Request, Response } from "express";


const ErrorMessage = (req:Request,res:Response,error:any,statusCode:number)=>{
            res.status(statusCode).json({error})
}
const MessageResponse = (req:Request,res:Response,data:any,statusCode:number)=>{
    res.status(statusCode).json({data})
}
const tokenAccess = (req:Request,res:Response,ACCESS_TOKEN:any,statusCode:number)=>{
    res.status(statusCode).json({ACCESS_TOKEN})
    
}

export {ErrorMessage,MessageResponse,tokenAccess }