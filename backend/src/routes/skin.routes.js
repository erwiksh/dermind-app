const express = require("express");

const router = express.Router();

const skinController = require(
  "../controllers/skin.controller"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const uploadMiddleware = require(
  "../middlewares/uploadMiddleware"
);

router.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,
      message: "Skin AI route ready",
    });
  }
);

router.get(
  "/history",
  authMiddleware,
  skinController.history
);

router.post(
  "/analyze",
  authMiddleware,
  uploadMiddleware.single(
    "image"
  ),
  skinController.analyze
);

module.exports = router;