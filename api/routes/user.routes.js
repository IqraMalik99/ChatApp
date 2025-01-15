import { Router } from "express";
import { auth } from "../middlerware/auth.middleware.js";
import { upload } from "../middlerware/multer.js";
import { signIn ,signUp ,signOut, getTokenCookies, getRequests, updateRequest } from "../controller/user.controller.js";
const userRouter = Router();
userRouter.route('/sign-in').post(signIn);
userRouter.route('/sign-out').post(auth,signOut);
userRouter.route('/sign-up').post(upload.single("avatar"),signUp);  
userRouter.route('/getToken/:Userstate.id').post(getTokenCookies);
userRouter.route('/getReq').get(auth,getRequests);
userRouter.route('/updateReq/:reqId').get(auth,updateRequest);
export {userRouter}