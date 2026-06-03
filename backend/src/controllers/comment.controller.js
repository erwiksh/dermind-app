const {
  getCommentsByPostId,
  createComment,
  deleteComment,
} = require("../services/comment.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.index = async (req, res) => {
  try {
    const comments =
      await getCommentsByPostId(
        req.params.postId
      );

    return successResponse(
      res,
      "Comments fetched successfully",
      comments
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message
    );
  }
};

exports.store = async (req, res) => {
  try {
    const {
      post_id,
      comment,
    } = req.body;

    const newComment =
      await createComment(
        post_id,
        req.user.id,
        comment
      );

    return successResponse(
      res,
      "Comment created successfully",
      newComment,
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message
    );
  }
};

exports.destroy = async (req, res) => {
  try {
    await deleteComment(
      req.params.id
    );

    return successResponse(
      res,
      "Comment deleted successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message
    );
  }
};  