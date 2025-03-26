const sequelize = require('../config/db');
const User = require('./user');
const Role = require('./role');

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

const db = {};
db.sequelize = sequelize;
db.User = User;
db.Role = Role;

module.exports = db;
