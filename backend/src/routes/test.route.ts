import { Router } from "express";
import { testApi } from "../controllers/test.controller.js";

const router = Router();

router.get("/test-api", testApi);

export default router;