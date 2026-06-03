const express = require("express");

const router = express.Router();

const commentController = require(
  "../controllers/comment.controller"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

router.get(
  "/post/:postId",
  commentController.index
);

router.post(
  "/",
  authMiddleware,
  commentController.store
);

router.delete(
  "/:id",
  authMiddleware,
  commentController.destroy
);

module.exports = router;