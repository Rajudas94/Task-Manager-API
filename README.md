# 📝 Task Manager Web Application

A full-stack Task Manager Web application built with **Flask and React**. User can register themselves, login using their credentials, and manage their tasks. The application focuses on **JWT authentication, REST APIs, and CRUD operations**.

# ✨ Features 
### 🔓 Authentication
- User registration and login.
- Password hashing using Bcrypt.
- JWT based authentication.
- Protected routes using access token.

### 📝 Task Management
- Create Task.
- View all tasks belonging to the logged in user.
- Update tasks details and completion status.
- Delete tasks.
- Each task is strictly associated with a single user.

### 🔐 Security
- JWT token validation for protected endpoints.
- User Specific task access using token identity.
- Passwords stored only in hashed form.


## 💼 Tech Stack
### Backend
- Python
- Flask
- REST APIs
- JWT
- Gunicorn
- Nginx

### Frontend
React

### Tools and Deployment
- Postman
- Git and Github
- vercel (frontend)
- EC2 (backend)

## 📏 Backend Design
The backend is implemented as a single Flask application file, to keep the system simple and easy.
within the file, the application logic is organized into clear logical sections :

- **Configuration & Initialization :**
Application setup, CORS configuration, environment variable loading, database initialization using SQLAlchemy, JWT Configuration and Password hashing using BCrypt.

- **Data Models :**
Two database models is defined:
  - `User` - stores user credentials with securly hashed passwords.
  - `Task` - stores task details and maintains a foreign key relationship with the user.

- **Authentication Logic :**
  Registration and login endpoints handle user creation and authentication.
  JWT access tokens are generated upon successful login and is required for accessing protected routes.

- **Protected Task APIs :**
Task related CRUD endpoints are protected using JWT authentication.
The User identity extracted from the token is used to ensure that users can only access and modify their own tasks.

- **Request Flow :**
requests are validated, authenticated, processed, persisted using SQLAlchemy and returned as JSON response.

## ✍ Application Flow
- User registers or logs in.
- Backend validates credentials and generate a JWT token.
- Token is sent with each protected API request.
- Backend extracts user identity from the token.
- User Specific tasks are created, viewed, updated or deleted.
- User logs out and the token is deleted from the LocalStorage.

## 🗂️ Project Structure
- will paste the structure from github

### 🔧 API Testing
- APIs tested using **Postman.**
- Authentication and Authorization Verified.

### 🖼️ Project Screenshots

- Landing Page
<img width="1317" height="615" alt="LandingPage" src="https://github.com/user-attachments/assets/1cdb62cd-98a7-47b9-b19e-76e050f52fb5" />

- Register / Login
<img width="1317" height="615" alt="Login" src="https://github.com/user-attachments/assets/1f11e95f-d8dc-4b59-b5ae-ade3aad41722" />

- Dashboard
<img width="1317" height="615" alt="Dashboard" src="https://github.com/user-attachments/assets/c062dbc6-1770-42f3-87eb-7a8cbcbdaa54" />
  
- Create Task
<img width="1317" height="615" alt="CreateTask" src="https://github.com/user-attachments/assets/c76c1607-1ae0-4708-9108-6d254e3f6510" />

- View Tasks
<img width="1317" height="615" alt="ViewTask" src="https://github.com/user-attachments/assets/afb18bdb-38c2-4952-a6f7-74018bbe72d0" />

- Update Tasks
<img width="1317" height="615" alt="UpdateTask-2" src="https://github.com/user-attachments/assets/b9bbb756-c92f-49ef-93e8-6a7ee1f1449c" />

<img width="1317" height="615" alt="UpdateTask-2" src="https://github.com/user-attachments/assets/7f9899b2-d4fb-48f0-928c-c10397e3b7b3" />

- Delete Tasks
<img width="1317" height="615" alt="DeleteTask" src="https://github.com/user-attachments/assets/79d90671-baf1-406c-92d5-74d33a434748" />

## 🎥 Walkthrough Video

👇 Click below to watch the demo of the app in action:  
[Watch Walkthrough Video](Media/Walkthrough.webm)

## 🔜 Future Improvements
- Task Priorities with duedates.
- Pagination and Filtering.
- Redis Caching.
- Docker Deployment.
- Performance Testing.

## 👨🏻‍💻 Developed and maintained By
**Raju Das** | Backend Engineer.
