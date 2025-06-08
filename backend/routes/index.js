import { Router } from 'express';
import userRoutes from './user_routes.js';
import taskRoutes from './taskRoutes.js';



const appRouter = Router();

appRouter.use("/user",userRoutes);
appRouter.use('/task', taskRoutes);



export default appRouter;
