const db = require('../models');
const { Op } = require('sequelize');

const User = db.User;
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    try {
        const { companyId, firstName, lastName, email, phoneNumber, password, roleId } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ message: "Either email or phone number is required for verification." });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        const existingUser = await User.findOne({
                    where: {
                        [Op.or]: [{ email }, { phoneNumber }]
                    }
                });

        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }
        

        const hashedPassword = await bcrypt.hash(password, 10);
        const dob = new Date(req.body.dob).toISOString().split('T')[0];

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

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, roleId } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user || user.status === "deleted") {
            return res.status(404).json({ message: "User not found or deleted" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({ firstName, lastName, email, phoneNumber, password: hashedPassword, roleId });
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
        if (!user || user.status === "deleted") {
            return res.status(404).json({ message: "User not found or deleted" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
};
