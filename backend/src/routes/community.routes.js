const express = require("express");

const router = express.Router();

const communityController = require(
  "../controllers/community.controller"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

router.get(
  "/",
  communityController.index
);

router.get(
  "/:id",
  communityController.show
);

router.post(
  "/",
  authMiddleware,
  communityController.store
);

router.put(
  "/:id",
  authMiddleware,
  communityController.update
);

router.delete(
  "/:id",
  authMiddleware,
  communityController.destroy
);

module.exports = router;