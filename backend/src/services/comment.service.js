const pool = require("../config/database");

const getCommentsByPostId = async (postId) => {
  const result = await pool.query(
    `
    SELECT
      c.*,
      u.name AS author_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
    `,
    [postId]
  );

  return result.rows;
};

const createComment = async (
  postId,
  userId,
  comment
) => {
  const result = await pool.query(
    `
    INSERT INTO comments
    (post_id, user_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [postId, userId, comment]
  );

  return result.rows[0];
};

const getCommentById = async (id) => {
  const result = await pool.query(
    `
    SELECT * FROM comments WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const deleteComment = async (id) => {
  await pool.query(
    `
    DELETE FROM comments
    WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  getCommentsByPostId,
  getCommentById,
  createComment,
  deleteComment,
};