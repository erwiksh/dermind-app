const pool = require("../config/database");

const getAllEvents = async () => {
  const result = await pool.query(`
    SELECT *
    FROM events
    ORDER BY event_date ASC
  `);

  return result.rows;
};

const getEventById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM events
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const createEvent = async (
  title,
  description,
  location,
  image,
  eventDate
) => {
  const result = await pool.query(
    `
    INSERT INTO events
    (
      title,
      description,
      location,
      image,
      event_date
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      title,
      description,
      location,
      image,
      eventDate
    ]
  );

  return result.rows[0];
};

const updateEvent = async (
  id,
  title,
  description,
  location,
  image,
  eventDate
) => {
  const result = await pool.query(
    `
    UPDATE events
    SET
      title = $1,
      description = $2,
      location = $3,
      image = $4,
      event_date = $5
    WHERE id = $6
    RETURNING *
    `,
    [
      title,
      description,
      location,
      image,
      eventDate,
      id
    ]
  );

  return result.rows[0];
};

const deleteEvent = async (id) => {
  await pool.query(
    `
    DELETE FROM events
    WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};