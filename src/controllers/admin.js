const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, phoneNumber, password: hashedPassword, role });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, role } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ firstName, lastName, email, phoneNumber, role });
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
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
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
};
