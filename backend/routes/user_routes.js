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

const userRoutes = Router();

// Routes for user operations
userRoutes.get("/:id", getUser); 
userRoutes.get("/", getAllUser); 
userRoutes.post("/login", loginUser)         
userRoutes.post("/signup", signupUser);         
userRoutes.put("/:id", updateUser);       
userRoutes.delete("/:id", deleteUser);   

userRoutes.post('/sendotp', sendOtp);
userRoutes.post('/verifyotp', verifyOtp);


export default userRoutes;