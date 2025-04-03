const db = require('../models');
const { Op } = require('sequelize');

const User = db.User;
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const {
            companyId,
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            roleId,
            dob
          } = req.body;

        const existingUser = await User.findOne({
                    where: {
                        [Op.or]: [{ email }, { phoneNumber }]
                    }
                });

        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }
        

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            companyId,
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            roleId,
            joiningDate : new Date(),
            dob
        });

        res.status(201).json({
            message: "User registered successfully! Next please verify via Email or SMS or both.",
            user: { id: user.id, firstName, lastName, email, phoneNumber }
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {
            companyId = null,
            firstName = null,
            lastName = null,
            email = null,
            phoneNumber = null,
            password = null,
            roleId = null,
            status = null
          } = req.body;


        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }

        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
          }

        const updatedData = Object.fromEntries(
            Object.entries({
              companyId,
              firstName,
              lastName,
              email,
              phoneNumber,
              hashedPassword,
              roleId,
              status
            }).filter(([_, value]) => value !== null)
          );

        await user.update(updatedData);
          
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.update(
            { status: "deleted" },
            { where: { id:user.id } }
        );
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
};
