# 🚀 User Database Management System (Task 1)  

A simple and efficient **User Management System** built with **Express.js** and **MySQL**, designed to manage user database of an organisation.  

## 📌 Features  
- User authentication (JWT-based)  
- Role-based access control (Admin & User)  
- Secure password management  
- Email and Phone Number verification  
- CRUD operations for users  

## 🛠️ Technologies Used  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **Authentication:** JWT (JSON Web Token)  
- **Environment Management:** dotenv  

## 📄 Environment Variables (`.env`)  

Before running the application, configure the following environment variables in a `.env` file:  

```ini
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_DIALECT=mysql

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_TOKEN_EXPIRATION=30d

# Cookie Configuration
COOKIE_EXPIRATION=2592000000  # 30 days in milliseconds

# Base URL
BASE_URL=http://localhost:5000

# Email Verification Secret
EMAIL_SECRET=your_email_secret_key

# Admin Credentials (for initial setup)
ADMIN_PHONENO=your_admin_phone
ADMIN_EMAIL=your_admin_email
ADMIN_PASS=your_admin_password

# Environment
NODE_ENV=development
```  

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```  

### 2️⃣ Install Dependencies  
```bash
npm install
```  

### 3️⃣ Configure Database  
- Ensure MySQL is installed and running.  
- Create a database and update `.env` variables accordingly.  

### 4️⃣  Start the Server  
```bash
npm run dev [this runs => nodemon app.js (so needs nodemon package installed to use this command.)]
```  
---

## 📜 API Endpoints  

### 🔐 Authentication Routes (`/api/auth/`)  
| Method  | Endpoint                | Description |
|---------|-------------------------|-------------|
| **POST**  | `/api/auth/register`     | Register a new user |
| **POST**  | `/api/auth/verifySMS`    | Verify user via SMS-OTP after /sendES |
| **POST**  | `/api/auth/verifyEmail`  | Verify user via email-token after /sendES |
| **POST**  | `/api/auth/login`        | Login user with email and password and initiating Two-Factor Authentication (2FA) |
| **POST**  | `/api/auth/TFAverifySMS` | Verify 2FA via SMS-OTP after /TFAsendES and log in |
| **POST**  | `/api/auth/TFAverifyEmail` | Verify 2FA via email-token after /TFAsendES and log in |
| **POST**  | `/api/auth/sendES`       | Send email/SMS to verify after registration or adding of new user |
| **POST**  | `/api/auth/TFAsendES`    | Send email/SMS for TFA verification |

### 👤 User Routes (`/api/user/`)  
| Method  | Endpoint                     | Description |
|---------|------------------------------|-------------|
| **PUT**  | `/api/user/profile/update`   | Update logged-in user's profile |
| **POST**  | `/api/user/logout`          | Logout user |

### 🛠️ Admin Routes (`/api/user/admin/`)  
| Method  | Endpoint               | Description |
|---------|------------------------|-------------|
| **POST**  | `/api/user/admin/create`  | Create a new user (Admin only) |
| **GET**   | `/api/user/admin/`        | Get all users (Admin only) |
| **GET**   | `/api/user/admin/:id`     | Get a specific user by ID (Admin only) |
| **PUT**   | `/api/user/admin/:id`     | Update a user by ID (Admin only) |
| **DELETE**| `/api/user/admin/:id`     | Delete a user by ID (Admin only) |

---


