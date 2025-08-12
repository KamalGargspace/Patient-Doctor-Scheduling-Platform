import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";


//auth authentication middleware for user

const authUser = asyncHandler(async (req, res, next) => {
   try {
    
         const {token} = req.headers;

         if(!token) {
            throw new ApiError(401, "Access token is missing");
         }

         const token_decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
         req.userId = token_decoded.id;

         
    next();

   } catch (error) {
      console.log(error);
      return res.status(401).json(error);
   }
});

export default authUser;
