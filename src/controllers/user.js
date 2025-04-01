const { User } = require('../models'); 


exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || user.status === "deleted") {
            return res.status(404).json({ message: "User not found or deleted" });
        }

        const { firstName, lastName, email, phoneNumber } = req.body;
        await user.update({ firstName, lastName, email, phoneNumber });

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

    res.clearCookie('authToken', { httpOnly: true, secure: true, sameSite: "None" }); // Clear the cookie
    return res.status(200).json({ message: "Logged out successfully" });
}

