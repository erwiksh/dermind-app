const express = require("express");

const router = express.Router();

const eventController = require(
  "../controllers/event.controller"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const adminMiddleware = require(
  "../middlewares/adminMiddleware"
);

// Public
router.get(
  "/",
  eventController.index
);

router.get(
  "/:id",
  eventController.show
);

// Admin Only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  eventController.store
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  eventController.update
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  eventController.destroy
);

module.exports = router;