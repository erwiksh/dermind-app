const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.uploadImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        "No file uploaded",
        400
      );
    }

    return successResponse(
      res,
      "Image uploaded successfully",
      {
        filename:
          req.file.filename,
        path:
          `/uploads/${req.file.filename}`,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message
    );
  }
};