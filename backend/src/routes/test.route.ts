import { Router } from "express";

const router = Router();

router.get("/test-api", (req, res) => {
    res.status(200).json({ message: "Test API is working!" });
});

export default router;