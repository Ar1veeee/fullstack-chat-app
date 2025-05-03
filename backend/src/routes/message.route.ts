import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { getMessages, getUserForSideBar, sendMessage } from "../controllers/message.controller";

const router = Router();

router.get("/users", protectRoute, getUserForSideBar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;