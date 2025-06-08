import { Router } from "express";
import { 
  getUser, 
  signupUser, 
  updateUser, 
  deleteUser,
  loginUser,
  getAllUser 
} from "../controllers/user_controller.js";
import { googleLogin, sendOtp, verifyOtp } from "../controllers/authController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authMiddleware } from "../middlewares/auth.js";

const userRoutes = Router();

// Routes for user operations
userRoutes.get("/:id", getUser,isAdmin,authMiddleware); 
userRoutes.get("/", getAllUser,isAdmin,authMiddleware); 
userRoutes.post("/login", loginUser)         
userRoutes.post("/signup", signupUser);         
userRoutes.put("/:id", updateUser,isAdmin,authMiddleware);       
userRoutes.delete("/:id", deleteUser,isAdmin,authMiddleware);   
userRoutes.post('/google-login', googleLogin);
userRoutes.post('/sendotp', sendOtp);
userRoutes.post('/verifyotp', verifyOtp);


export default userRoutes;