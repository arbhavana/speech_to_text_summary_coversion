const pool = require("./database.js");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
  } else {
    console.log("✅ DB Connected:", res.rows);
  }
  pool.end();
});
