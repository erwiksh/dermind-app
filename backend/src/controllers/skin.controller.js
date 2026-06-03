const {
  analyzeSkin,
  saveSkinResult,
  getSkinHistory,
} = require("../services/skin.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.analyze = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        "Image is required",
        400
      );
    }

    const result =
      await analyzeSkin(
        req.file.path
      );

    const confidence =
      Number(
        (
          result.confidence * 100
        ).toFixed(2)
      );

    await saveSkinResult(
      req.user.id,
      `/uploads/${req.file.filename}`,
      result.predicted_class,
      confidence
    );

    return successResponse(
      res,
      "Skin analysis success",
      {
        condition:
          result.predicted_class,
        confidence,
        probabilities:
          result.probabilities,
      }
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      500
    );
  }
};

exports.history = async (
  req,
  res
) => {
  try {
    const history =
      await getSkinHistory(
        req.user.id
      );

    return successResponse(
      res,
      "Skin history retrieved",
      history
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      500
    );
  }
};