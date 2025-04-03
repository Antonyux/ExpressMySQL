const { body, validationResult } = require("express-validator");

const validationRules = [
  body("email")
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  
  body("phoneNumber")
    .optional({ nullable: true })
    .trim()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("password")
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Exporting the array of middlewares 
module.exports = [...validationRules, validate];
