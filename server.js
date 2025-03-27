require('dotenv').config();
const app = require('./src/app');


const db = require('./src/models');

const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize.sync({ force: false }) // Change to 'true' to recreate tables
  .then(async () => {
    console.log("✅ Database synced successfully");

    // Ensure the Role table exists before inserting Users
    await db.Role.sync();
    await db.User.sync();
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.log("Error: " + err));
