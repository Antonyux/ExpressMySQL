const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const generateEmailToken = require('../utils/generateEmailToken');
const sendEmail = require('../utils/sendEmail');
const generateOTP = require('../utils/generateOTP');
const sendSMS = require('../utils/sendSMS');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        
        // Ensure at least one verification method is provided
        if (!email && !phoneNumber) {
            return res.status(400).json({ message: "Either email or phone number is required for verification." });
        }

        // Check if email or phone number is already registered
        const existingUser = await User.findOne({ 
            where: { 
                [db.Sequelize.Op.or]: [{ email }, { phoneNumber }] 
            } 
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in the database (unverified)
        const user = await User.create({ 
            firstName, 
            lastName, 
            email, 
            phoneNumber, 
            password: hashedPassword,
            email_verified: false, 
            phone_verified: false
        });

        // Generate and send verification (either Email or SMS)
        if (email) {
            const emailToken = generateEmailToken(user.id);
            const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${emailToken}`;
            await sendEmail(email, "Verify Your Email", `Click here to verify your email: ${verificationLink}`);
        }

        if (phoneNumber) {
            const otp = generateOTP();
            await User.update({ otp }, { where: { id: user.id } });
            await sendSMS(phoneNumber, `Your OTP code is: ${otp}`);
        }

        res.status(201).json({ 
            message: "User registered successfully! Please verify via Email or SMS.",
            user: { id: user.id, firstName, lastName, email, phoneNumber }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error registering user" });
    }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });


    // Generate JWT token
    const token = generateToken(user);

    
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

/*
sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

    const otp = generateOTP();
    await User.update({ otp }, { where: { phoneNumber } }); // Save OTP in DB

    await sendSMS(phoneNumber, `Your OTP code is: ${otp}`); // Send OTP via SMS

    res.json({ message: 'OTP sent successfully!' });
};
*/
