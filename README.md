# Authentication System for CMS Dashboard

## 1.1 Purpose  
This project outlines the requirements for the authentication system of a CMS dashboard. The system enables users to log in using their email and password and ensures secure access through role-based permissions (Admin and Editor). Admin users have full control over user management and authorization, providing a robust and efficient solution for content management.

## 1.2 Scope  
The authentication system includes the following features:  
- **Secure Login:** Users can log in using their email and password.  
- **Token Management:** Generates and validates tokens for session management, valid for 7 days.  
- **Role-Based Access Control (RBAC):** Supports two roles: Admin and Editor.  
- **User Management:** Admins can add new users and assign custom permissions for specific sections.  
- **Role Restriction:** Editors cannot modify their own roles or permissions.  
- **Content Security:** Ensures secure content management based on user permissions.  

## 1.3 Definitions, Acronyms, and Abbreviations  
- **RBAC:** Role-Based Access Control.  
- **Token:** A unique identifier used for session management (e.g., JWT - JSON Web Token).  
- **Admin:** A user with full access to the system, including user management.  
- **Editor:** A user with limited access to content management based on assigned permissions.  

---

### Contributions  
Feel free to fork this repository, make changes, and submit pull requests for enhancements or bug fixes.  



### Contact  
For any questions or support, please contact farouk.adel931@gmail.com.  
