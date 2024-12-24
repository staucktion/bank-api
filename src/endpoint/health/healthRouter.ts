import express from "express";
import Config from "src/config/Config";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
  });
});

router.get("/health/info", (req, res) => {
  res.status(200).json({
    status: "UP",
    mode: Config.mode,
    description: "this api provides simulated bank api actions",
  });
});

export default router;
