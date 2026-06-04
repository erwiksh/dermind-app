const { Pool } = require("pg");
const pool = require("../config/database");

async function check() {
  try {
    console.log("Checking DB connection...");
    await pool.query("SELECT NOW()");
    console.log("Connected. Checking table chatbot_histories...");
    const res = await pool.query("SELECT * FROM chatbot_histories LIMIT 1");
    console.log("Success! chatbot_histories exists, rows found:", res.rows.length);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await pool.end();
  }
}

check();
