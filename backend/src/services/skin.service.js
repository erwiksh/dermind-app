const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const pool = require("../config/database");

const analyzeSkin = async (filePath) => {
  const formData = new FormData();

  formData.append(
    "image",
    fs.createReadStream(filePath)
  );

  const response = await axios.post(
    `${process.env.AI_BASE_URL}/skin/infer`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "X-Dermind-Key":
          process.env.AI_API_KEY,
      },
    }
  );

  return response.data;
};

const saveSkinResult = async (
  userId,
  imageUrl,
  prediction,
  confidence
) => {
  const result = await pool.query(
    `
    INSERT INTO skin_results
    (
      user_id,
      image_url,
      prediction,
      confidence
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
      imageUrl,
      prediction,
      confidence,
    ]
  );

  return result.rows[0];
};

const getSkinHistory = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM skin_results
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

module.exports = {
  analyzeSkin,
  saveSkinResult,
  getSkinHistory,
};