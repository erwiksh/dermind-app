const pool = require("../config/database");

const getAllPosts = async () => {
  const result = await pool.query(`
    SELECT
      cp.*,
      u.name AS author_name
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    ORDER BY cp.created_at DESC
  `);

  return result.rows;
};

const getPostById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      cp.*,
      u.name AS author_name
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    WHERE cp.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const createPost = async (
  userId,
  title,
  content
) => {
  const result = await pool.query(
    `
    INSERT INTO community_posts
    (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, title, content]
  );

  return result.rows[0];
};

const updatePost = async (
  id,
  title,
  content
) => {
  const result = await pool.query(
    `
    UPDATE community_posts
    SET
      title = $1,
      content = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [title, content, id]
  );

  return result.rows[0];
};

const deletePost = async (id) => {
  await pool.query(
    `
    DELETE FROM community_posts
    WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};