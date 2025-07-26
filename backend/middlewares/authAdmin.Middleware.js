import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";


//auth authentication middleware for admin

const authAdmin = asyncHandler(async (req, res, next) => {
   try {
    
         const {access_token} = req.headers;

         if(!access_token) {
            throw new ApiError(401, "Access token is missing");
         }

         const token_decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);

         if(token_decoded.email !== process.env.ADMIN_EMAIL) {
            throw new ApiError(401, "Invalid access token");
         }
   next();

   } catch (error) {
      console.log(error);
      return res.status(401).json(error);
   }
});

export default authAdmin;
