const {
  analyzeMentalHealth,
  saveMentalResult,
  getMentalHistory,
} = require("../services/mental.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.analyze = async (
  req,
  res
) => {
  try {
    const { text } = req.body;

    if (!text) {
      return errorResponse(
        res,
        "Text is required",
        400
      );
    }

    const aiResult =
      await analyzeMentalHealth(
        text
      );

    await saveMentalResult(
      req.user.id,
      text,
      aiResult.label,
      aiResult.confidence
    );

    return successResponse(
      res,
      "Mental analysis success",
      {
        status:
          aiResult.label,
        confidence:
          aiResult.confidence,
        breakdown:
          aiResult.breakdown,
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
      await getMentalHistory(
        req.user.id
      );

    return successResponse(
      res,
      "Mental history retrieved",
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