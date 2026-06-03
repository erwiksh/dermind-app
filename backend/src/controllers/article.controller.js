const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../services/article.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.index = async (req, res) => {
  try {
    const articles = await getAllArticles();

    return successResponse(
      res,
      "Articles fetched successfully",
      articles
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.show = async (req, res) => {
  try {
    const article = await getArticleById(
      req.params.id
    );

    if (!article) {
      return errorResponse(
        res,
        "Article not found",
        404
      );
    }

    return successResponse(
      res,
      "Article fetched successfully",
      article
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.store = async (req, res) => {
  try {
    const {
      title,
      content,
      image,
    } = req.body;

    const article = await createArticle(
      title,
      content,
      image,
      req.user.id
    );

    return successResponse(
      res,
      "Article created successfully",
      article,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const {
      title,
      content,
      image,
    } = req.body;

    const article = await updateArticle(
      req.params.id,
      title,
      content,
      image
    );

    return successResponse(
      res,
      "Article updated successfully",
      article
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.destroy = async (req, res) => {
  try {
    await deleteArticle(req.params.id);

    return successResponse(
      res,
      "Article deleted successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};