const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const db = require('./db');

app.use(express.static(PUBLIC_DIR));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Kết nối DB trước khi bắt server
db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Cinema ticket UI running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Không thể kết nối MongoDB:', err);
    process.exit(1);
  });

