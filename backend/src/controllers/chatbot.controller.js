const {
  sendMessage,
  saveChatHistory,
  getChatHistory,
} = require("../services/chatbot.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

exports.chat = async (
  req,
  res
) => {
  try {
    const message =
      req.body?.message;

    if (!message) {
      return errorResponse(
        res,
        "Message is required",
        400
      );
    }

    const result =
      await sendMessage(
        message,
        req.user?.id || "1"
      );

    const answer =
      result.response ||
      "No response";

    await saveChatHistory(
      req.user.id,
      message,
      answer
    );

    return successResponse(
      res,
      "Chatbot response",
      result
    );
  } catch (error) {
    console.log(
      "CHATBOT ERROR:",
      error.response?.data
    );

    return errorResponse(
      res,
      error.response?.data?.message ||
        error.message,
      error.response?.status ||
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
      await getChatHistory(
        req.user.id
      );

    return successResponse(
      res,
      "Chat history retrieved",
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