const pool = require("../config/database");

const globalSearch = async (keyword) => {
  const searchTerm = `%${keyword}%`;

  const articles = await pool.query(
    `
    SELECT
      id,
      title,
      content,
      created_at
    FROM articles
    WHERE
      title ILIKE $1
      OR content ILIKE $1
    `,
    [searchTerm]
  );

  const communityPosts = await pool.query(
    `
    SELECT
      id,
      title,
      content,
      created_at
    FROM community_posts
    WHERE
      title ILIKE $1
      OR content ILIKE $1
    `,
    [searchTerm]
  );

  const events = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      event_date
    FROM events
    WHERE
      title ILIKE $1
      OR description ILIKE $1
    `,
    [searchTerm]
  );

  return {
    articles: articles.rows,
    community_posts: communityPosts.rows,
    events: events.rows,
  };
};

module.exports = {
  globalSearch,
};