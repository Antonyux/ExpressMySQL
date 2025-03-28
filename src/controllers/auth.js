const bcrypt = require('bcryptjs');
const db = require('../models');
const axios = require('axios');

const generateEmailToken = require('../utils/generateEmailToken');
const generateOTP = require('../utils/generateOTP');
const generateToken = require('../utils/generateToken')

const User = db.User;

const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');



const sendEmail = async (to, subject, text) => {
    console.log(`Sending email to ${to}: ${subject} - ${text}`);
};

const sendSMS = async (phone, message) => {
    console.log(`Sending SMS to ${phone}: ${message}`);
};

exports.register = async (req, res) => {
    try {
        const { companyId, firstName, lastName, email, phoneNumber, password, roleId, joiningDate, dob } = req.body;

        // Ensure at least one verification method is provided
        if (!email && !phoneNumber) {
            return res.status(400).json({ message: "Either email or phone number is required for verification." });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Check if email or phone number is already registered
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in the database (unverified)
        const user = await User.create({
            companyId,
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            roleId,
            joiningDate,
            dob
        });

        res.status(201).json({
            message: "User registered successfully! Next please verify via Email or SMS or both.",
            user: { id: user.id, firstName, lastName, email, phoneNumber }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error registering user" });
    }
};


exports.sendEmailSMS = async (req, res) => {
    try {
        // const { email, phoneNumber } = req.body;
        const email = req.body.email ? req.body.email : null;
        const phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : null;

        // Ensure at least one verification method is provided
        if (!email && !phoneNumber) {
            return res.status(400).json({ error: "Either email or phone number is required for verification." });
        }

        // Find user by email or phone number
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ Handle email verification
        if (email) {
            const emailToken = generateEmailToken(user.email);
            const verificationLink = `${process.env.BASE_URL}/api/auth/email?token=${emailToken}`;
            await sendEmail(email, "Verify Your Email", `Click here to verify your email: <a href="${verificationLink}">Verify Email</a>`);
        }

        // ✅ Handle SMS verification
        if (phoneNumber) {
            const { otp, expiresAt } = generateOTP();
            await user.update({ otp, otpExpiresAt: expiresAt });
            await sendSMS(phoneNumber, `Your OTP code is: ${otp}`);
        }

        res.json({ message: "Verification email/SMS sent successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error sending email or SMS OTP" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ensure phone or email is verified
        if (!user.phone_verified && !user.email_verified) {
            return res.status(403).json({ error: "Account not verified. Please verify your phone number or email." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Set secure, HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Protects against CSRF attacks
            maxAge: 1 * 60 * 60 * 1000 // 1 hour
        });

        res.json({ message: "Login successful" });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Error logging in" });
    }
};


exports.emailVerify = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Invalid or missing token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

        // Find user
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Mark email as verified
        await User.update({ email_verified: true }, { where: { id: user.id } });

        return res.json({ message: 'Email verified successfully!' });

    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
};



exports.smsVerify = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        // Find user
        const user = await User.findOne({ where: { phoneNumber } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check OTP validity
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Mark phone number as verified
        await User.update(
            { otp: null, otpExpiresAt: null, phone_verified: true },
            { where: { phoneNumber } }
        );

        return res.json({ message: 'Phone number verified successfully!' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





// async function sendSMS(phoneNumber, message) {
//   try {
//     const response = await axios.post('https://textbelt.com/text', {
//       phone: phoneNumber,
//       message: message,
//       key: 'textbelt', // Free key (limited to 1 message per day)
//     });

//     if (response.data.success) {
//       console.log(`SMS sent successfully to ${phoneNumber}`);
//     } else {
//       console.error('Failed to send SMS:', response.data);
//       throw new Error(response.data.error || 'Failed to send SMS');
//     }
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     throw new Error('Failed to send SMS verification');
//   }
// }

// // Example Usage:
// // sendSMS('+1234567890', 'Hello from Textbelt!');


// // Nodemailer Email Service
// async function sendEmail(to, subject, html) {
// try {
//     // Create a transporter using SMTP
//     const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
//     });

//     // Send email
//     await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: to,
//     subject: subject,
//     html: html
//     });

//     console.log(`Email sent successfully to ${to}`);
// } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send verification email');
// }
// }


