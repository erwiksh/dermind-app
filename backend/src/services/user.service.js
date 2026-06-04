const pool = require("../config/database");

const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, role, avatar, created_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};

const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

module.exports = {
  getAllUsers,
  deleteUser,
};
