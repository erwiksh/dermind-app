const express = require("express");

const router = express.Router();

const chatbotController = require(
  "../controllers/chatbot.controller"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

router.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Chatbot AI route ready",
    });
  }
);

router.get(
  "/history",
  authMiddleware,
  chatbotController.history
);

router.post(
  "/message",
  authMiddleware,
  chatbotController.chat
);

module.exports = router;