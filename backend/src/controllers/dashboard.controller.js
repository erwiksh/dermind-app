const {
  getDashboardStats,
} = require("../services/dashboard.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.index = async (req, res) => {
  try {
    const stats =
      await getDashboardStats();

    return successResponse(
      res,
      "Dashboard data fetched successfully",
      stats
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message
    );
  }
};