const pool = require("../config/database");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};

const createUser = async ({
  name,
  email,
  password,
}) => {
  const result = await pool.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password
    )
    VALUES
    (
      $1,
      $2,
      $3
    )
    RETURNING
      id,
      name,
      email,
      role
    `,
    [
      name,
      email,
      password,
    ]
  );

  return result.rows[0];
};

const updateUserProfile = async (
  id,
  name,
  email
) => {

  const result = await pool.query(
    `
    UPDATE users
    SET
      name = $1,
      email = $2
    WHERE id = $3
    RETURNING
      id,
      name,
      email,
      role
    `,
    [
      name,
      email,
      id
    ]
  );

  return result.rows[0];
};

const updateUserPassword = async (
  id,
  password
) => {

  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE id = $2
    `,
    [
      password,
      id
    ]
  );

};

module.exports = {
  findUserByEmail,
  createUser,
  updateUserProfile,
  updateUserPassword,
};