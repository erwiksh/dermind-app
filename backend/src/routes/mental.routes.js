const express = require("express");

const router = express.Router();

const mentalController = require(
  "../controllers/mental.controller"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

router.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,
      message: "Mental AI route ready",
    });
  }
);

router.get(
  "/history",
  authMiddleware,
  mentalController.history
);

router.post(
  "/analyze",
  authMiddleware,
  mentalController.analyze
);

module.exports = router;