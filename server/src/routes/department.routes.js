import { Router } from "express";
import { registerDepartment,loginDepartment,
    logoutDepartment,
    refreshAccessTokendept,
    changeCurrentPassworddept,
    getCurrentDepartment,
    updateAccountDetailsdept } from "../controllers/department.controller.js";

import { getPendingcomplaints,getNonPendingComplaints, updatecomplaint } from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const router=Router();
router.route("/register").post(registerDepartment);
router.route("/login").post(loginDepartment);
router.route("/logout").post(logoutDepartment);
router.route("/refresh-token").post(refreshAccessTokendept);
router.route("/change-password").post(verifyJWT, changeCurrentPassworddept);
router.route("/current-user").get(verifyJWT, getCurrentDepartment);
router.route("/update-account").patch(verifyJWT, updateAccountDetailsdept);
router.route("/profile/pending-complaints").get(verifyJWT, getPendingcomplaints);
router.route("/profile/non-pending-complaints").get(verifyJWT, getNonPendingComplaints);
//router.route("/profile/emergency-email").post(verifyJWT, sendEmergencyEmail);
router.route("/profile/update-complaint").patch(verifyJWT, updatecomplaint);