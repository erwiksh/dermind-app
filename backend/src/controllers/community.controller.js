const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../services/community.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.index = async (req, res) => {
  try {
    const posts = await getAllPosts();

    return successResponse(
      res,
      "Community posts fetched successfully",
      posts
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.show = async (req, res) => {
  try {
    const post = await getPostById(
      req.params.id
    );

    if (!post) {
      return errorResponse(
        res,
        "Post not found",
        404
      );
    }

    return successResponse(
      res,
      "Post fetched successfully",
      post
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.store = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await createPost(
      req.user.id,
      title,
      content
    );

    return successResponse(
      res,
      "Post created successfully",
      post,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await updatePost(
      req.params.id,
      title,
      content
    );

    return successResponse(
      res,
      "Post updated successfully",
      post
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.destroy = async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return errorResponse(res, "Post not found", 404);
    }

    if (req.user.role !== "admin" && post.user_id !== req.user.id) {
      return errorResponse(res, "Access denied. You can only delete your own posts.", 403);
    }

    await deletePost(req.params.id);

    return successResponse(
      res,
      "Post deleted successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};