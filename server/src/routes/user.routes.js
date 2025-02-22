import { Router } from "express";
import {  changeCurrentPasswordUser, getCurrentUser,loginUser, logoutUser, refreshAccessTokenUser, registerUser} from "../controllers/user.controller.js";
import { filecomplaint, getcomplaint } from "../controllers/complaint.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


export const router=Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessTokenUser);
router.route("/change-password").post(verifyJWT, changeCurrentPasswordUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/profile/raise-complaint").post(upload.fields([
    {name:"complaintImage",
        maxCount:1
    }
]),verifyJWT, filecomplaint);//file upload remaining
router.route("/profile/get-complaints").get(verifyJWT, getcomplaint);