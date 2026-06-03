const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

async function runMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationDir = path.join(
      __dirname,
      "../migrations"
    );

    const files = fs
      .readdirSync(migrationDir)
      .filter((file) =>
        file.endsWith(".sql")
      )
      .sort();

    for (const file of files) {
      const exists =
        await pool.query(
          `
          SELECT *
          FROM migrations
          WHERE filename = $1
          `,
          [file]
        );

      if (
        exists.rows.length > 0
      ) {
        console.log(
          `⏭ Skipping ${file}`
        );
        continue;
      }

      console.log(
        `🚀 Running ${file}`
      );

      const sql =
        fs.readFileSync(
          path.join(
            migrationDir,
            file
          ),
          "utf8"
        );

      await pool.query(sql);

      await pool.query(
        `
        INSERT INTO migrations
        (filename)
        VALUES ($1)
        `,
        [file]
      );

      console.log(
        `✅ ${file}`
      );
    }

    console.log(
      "🎉 Migration completed"
    );

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

runMigration();