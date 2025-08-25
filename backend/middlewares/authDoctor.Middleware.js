import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";


//auth authentication middleware for user

const authDoctor = asyncHandler(async (req, res, next) => {
   try {
    
         const dToken = req.headers["dtoken"];

        //  console.log("dToken:", dToken);

         if(!dToken) {
            throw new ApiError(401, "Access token is missing");
         }

         const token_decoded = jwt.verify(dToken, process.env.JWT_SECRET_KEY);
         req.doctorId = token_decoded.id;

    next();

   } catch (error) {
      console.log(error);
      return res.json(new ApiError(401, error.message));
   }
});

export default authDoctor;
