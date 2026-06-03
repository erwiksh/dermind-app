const {
  globalSearch,
} = require("../services/search.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return errorResponse(
        res,
        "Keyword is required",
        400
      );
    }

    const result = await globalSearch(q);

    return successResponse(
      res,
      "Search completed",
      result
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message
    );
  }
};