const express = require("express");

const router = express.Router();

const articleController = require(
  "../controllers/article.controller"
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
  articleController.index
);

router.get(
  "/:id",
  articleController.show
);

// Admin Only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  articleController.store
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  articleController.update
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  articleController.destroy
);

module.exports = router;