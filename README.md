
# Bussniess of News System

## Purpose  
This project outlines the requirements for the authentication system of a CMS dashboard. The system enables users to log in using their email and password and ensures secure access through role-based permissions (Admin and Editor). Admin users have full control over user management and authorization, providing a robust and efficient solution for content management.

## Scope  
The authentication system includes the following features:
- **Secure Login:** Users can log in using their email and password.
- **Token Management:** Generates and validates tokens for session management, valid for 7 days.
- **Role-Based Access Control (RBAC):** Supports two roles: Admin and Editor.
- **User Management:** Admins can add new users and assign custom permissions for specific sections.
- **Role Restriction:** Editors cannot modify their own roles or permissions.
- **Content Security:** Ensures secure content management based on user permissions.

---

## Getting Started

### Prerequisites  
- **Node.js** (v16 or above)
- **npm** (v7 or above)
- **MongoDB** (Ensure MongoDB is running locally or provide a connection string for a cloud instance like MongoDB Atlas)

### Installation  

#### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

#### 2. Configure Environment Variables  
Create a `.env` file in the root directory and add the following attributes:
```plaintext
NODE_ENV 
HOST 
PORT 
DATABASE
JWT_SECRET 
JWT_EXPIRES_IN 
JWT_COOKIE_EXPIRES_IN 
```

#### 3. Install Dependencies  
```bash
npm install
```

### Build and Run  

#### Build the Project  
```bash
npm run build
```

#### Start the Server  
```bash
npm start
```
The server will run on `http://127.0.0.1:5000` (default settings).

---

## Post-Setup  

### Create an Admin Account  
Use an API testing tool (e.g., Postman) to create an admin account:
1. Make a `POST` request to the user creation endpoint.
2. Assign the `Admin` role to the new user.

### Import Postman Collection  
1. Import the provided Postman collection file (found in `/postman/collection.json`).
2. Use the collection to test endpoints like:
   - **Login**
   - **Token validation**
   - **User management**

### Example Postman Collection Import  
If you don't have the file yet, you can create it manually by adding API requests with the following structure.

---

## Contributions  
Feel free to fork this repository, make changes, and submit pull requests for enhancements or bug fixes.

---

## Contact  
For any questions or support, please contact **farouk.adel931@gmail.com**.
