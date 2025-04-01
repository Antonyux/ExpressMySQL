const { User } = require('../models'); 


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

