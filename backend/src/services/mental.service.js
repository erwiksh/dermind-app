const axios = require("axios");
const pool = require("../config/database");

const analyzeMentalHealth = async (text) => {
  const response = await axios.post(
    `${process.env.AI_BASE_URL}/mental/infer`,
    {
      text,
    },
    {
      headers: {
        "X-Dermind-Key":
          process.env.AI_API_KEY,
      },
    }
  );

  return response.data;
};

const saveMentalResult = async (
  userId,
  inputText,
  prediction,
  score
) => {
  const result = await pool.query(
    `
    INSERT INTO mental_results
    (
      user_id,
      input_text,
      prediction,
      score
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *
    `,
    [
      userId,
      inputText,
      prediction,
      score,
    ]
  );

  return result.rows[0];
};

const getMentalHistory = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM mental_results
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

module.exports = {
  analyzeMentalHealth,
  saveMentalResult,
  getMentalHistory,
};