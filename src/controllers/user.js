const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');


exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || user.status === "deleted") {
            return res.status(404).json({ message: "User not found or deleted" });
        }

        const {
            firstName = null,
            lastName = null,
            email = null,
            phoneNumber = null,
            password = null
          } = req.body;

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }

        if (password && password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }
        
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
            }

        const updatedData = Object.fromEntries(
            Object.entries({
              firstName,
              lastName,
              email,
              phoneNumber,
              hashedPassword
            }).filter(([_, value]) => value !== null)
          );

        await user.update(updatedData);

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating profile" });
    }
};


exports.logout = async (req, res) => {
    
    const user = await User.findByPk(req.user.id);
    
    if (!user || user.status === "deleted") {
        return res.status(404).json({ message: "User not found or deleted" });
    }

    await user.update({ status: "inactive" }, { where: { id: User.id } });

    res.clearCookie('authToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "None" }); 
    return res.status(200).json({ message: "Logged out successfully" });
}

