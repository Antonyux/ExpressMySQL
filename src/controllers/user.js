const bcrypt = require('bcryptjs');
const { User, Role } = require('../models'); 
const { validationResult } = require('express-validator');

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ firstName, lastName, email, phoneNumber });
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error updating profile" });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { firstName, lastName, email, phoneNumber } = req.body;
        await user.update({ firstName, lastName, email, phoneNumber });

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating profile" });
    }
};

