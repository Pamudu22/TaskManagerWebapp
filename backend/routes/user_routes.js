import { Router } from "express";
import { 
  getUser, 
  signupUser, 
  updateUser, 
  deleteUser,
  loginUser,
  getAllUser 
} from "../controllers/user_controller.js";
import { sendOtp, verifyOtp } from "../controllers/authController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authMiddleware } from "../middlewares/auth.js";

const userRoutes = Router();

// Routes for user operations
userRoutes.get("/:id", getUser,authMiddleware,isAdmin); 
userRoutes.get("/", getAllUser,authMiddleware,isAdmin); 
userRoutes.post("/login", loginUser)         
userRoutes.post("/signup", signupUser);         
userRoutes.put("/:id", updateUser,authMiddleware,isAdmin);       
userRoutes.delete("/:id", deleteUser,authMiddleware,isAdmin);   

userRoutes.post('/sendotp', sendOtp);
userRoutes.post('/verifyotp', verifyOtp);


export default userRoutes;