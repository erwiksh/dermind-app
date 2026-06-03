const express = require("express");

const router = express.Router();

const uploadMiddleware = require(
  "../middlewares/uploadMiddleware"
);

const uploadController = require(
  "../controllers/upload.controller"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("image"),
  uploadController.uploadImage
);

module.exports = router;