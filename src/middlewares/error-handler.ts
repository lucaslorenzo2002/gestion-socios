import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error.js";

export const errorHandler = (
    err:Error, 
    req: Request, 
    res:Response, 
    next: NextFunction
    ) => {
    if(err instanceof CustomError) {
        return res.status(err.statusCode ).json({errors: err.serielizeErrors()})
    }
        
        return  res.status(500).json({message: err.message})
    }