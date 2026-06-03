const pool = require("../config/database");

const getDashboardStats = async () => {
  const usersResult = await pool.query(
    "SELECT COUNT(*) AS total FROM users"
  );

  const articlesResult = await pool.query(
    "SELECT COUNT(*) AS total FROM articles"
  );

  const communityResult = await pool.query(
    "SELECT COUNT(*) AS total FROM community_posts"
  );

  const commentsResult = await pool.query(
    "SELECT COUNT(*) AS total FROM comments"
  );

  const eventsResult = await pool.query(
    "SELECT COUNT(*) AS total FROM events"
  );

  return {
    users: Number(usersResult.rows[0].total),
    articles: Number(articlesResult.rows[0].total),
    community_posts: Number(
      communityResult.rows[0].total
    ),
    comments: Number(
      commentsResult.rows[0].total
    ),
    events: Number(eventsResult.rows[0].total),
  };
};

module.exports = {
  getDashboardStats,
};