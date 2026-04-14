require('dotenv').config();
const app = require('./app');
const mongodb = require('./data/database');

const port = process.env.PORT || 3000;

mongodb.initDb((err) => {
  if (err) {
    console.log("❌ DB connection failed:", err.message);
  } else {
    app.listen(port, () => {
      console.log(`✅ TaskFlow API running on port ${port}`);
    });
  }
});