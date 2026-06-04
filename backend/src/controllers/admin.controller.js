const { getAllUsers, deleteUser } = require("../services/user.service");
const { successResponse, errorResponse } = require("../utils/response");

exports.getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return successResponse(res, "Users fetched successfully", users);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user && String(req.user.id) === String(id)) {
      return errorResponse(res, "You cannot delete your own account", 400);
    }

    await deleteUser(id);
    return successResponse(res, "User deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
