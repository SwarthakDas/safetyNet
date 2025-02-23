import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
import {Department} from "../models/department.model.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        let secretKey, model, userType;

        if (req.originalUrl.startsWith("/department")) {
            secretKey = process.env.ACCESS_TOKEN_SECRET_DEPT;
            model = Department;
            userType = "department";
        } else if (req.originalUrl.startsWith("/civilian")) {
            secretKey = process.env.ACCESS_TOKEN_SECRET_USER;
            model = User;
            userType = "civilian";
        } else {
            throw new ApiError(401, "Unauthorized request: Invalid route");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, secretKey);
        } catch (error) {
            throw new ApiError(401, "Invalid or Expired Access Token");
        }

        const user = await model.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        if (userType === "department") {
            req.department = user; // Attach to req as department
        } else {
            req.user = user; // Attach to req as user
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
});
