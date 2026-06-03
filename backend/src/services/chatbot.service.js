const axios = require("axios");
const pool = require("../config/database");

const sendMessage = async (
  message,
  userId = "1"
) => {
  try {
    const response =
      await axios.post(
        `${process.env.AI_BASE_URL}/chat`,
        {
          message,
          user_id: String(userId),
        },
        {
          headers: {
            "Content-Type":
              "application/json",
            "X-Dermind-Key":
              process.env.AI_API_KEY,
          },
        }
      );

    return response.data;
  } catch (error) {
    console.log(
      "AI CHAT ERROR:",
      error.response?.data
    );

    throw error;
  }
};

const saveChatHistory = async (
  userId,
  question,
  answer
) => {
  const result = await pool.query(
    `
    INSERT INTO chatbot_histories
    (
      user_id,
      question,
      answer
    )
    VALUES
    (
      $1,
      $2,
      $3
    )
    RETURNING *
    `,
    [
      userId,
      question,
      answer,
    ]
  );

  return result.rows[0];
};

const getChatHistory = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM chatbot_histories
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

module.exports = {
  sendMessage,
  saveChatHistory,
  getChatHistory,
};