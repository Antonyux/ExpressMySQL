const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('Roles', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, { timestamps: true });


Role.afterSync(async () => {
  const roles = ["Admin", "Engineer", "Manager"];
  for (const roleName of roles) {
    await Role.findOrCreate({
      where: { name: roleName },
      defaults: { name: roleName }
    });
  }
  console.log("✅ Default roles inserted");
});


module.exports = Role;
