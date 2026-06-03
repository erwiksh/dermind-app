const pool = require("../config/database");

const getAllArticles = async () => {
  const result = await pool.query(`
    SELECT *
    FROM articles
    ORDER BY created_at DESC
  `);

  return result.rows;
};

const getArticleById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM articles WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

const createArticle = async (
  title,
  content,
  image,
  authorId
) => {
  const result = await pool.query(
    `
    INSERT INTO articles
    (title, content, image, author_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, content, image, authorId]
  );

  return result.rows[0];
};

const updateArticle = async (
  id,
  title,
  content,
  image
) => {
  const result = await pool.query(
    `
    UPDATE articles
    SET
      title = $1,
      content = $2,
      image = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
    `,
    [title, content, image, id]
  );

  return result.rows[0];
};

const deleteArticle = async (id) => {
  await pool.query(
    `DELETE FROM articles WHERE id = $1`,
    [id]
  );
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};