require('dotenv').config();
const app = require('./src/app');


const db = require('./src/models');

const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize.sync().then(() => {
  console.log("Database connected");

  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.log("Error: " + err));
