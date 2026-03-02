# Team Evaluation System - Spring Boot

A REST API for team evaluation with JWT authentication and MySQL.

---

## ⚙️ Setup Instructions

### 1. Configure MySQL
Edit `src/main/resources/application.properties`:
```
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```
> The database `evaluation_db` will be created automatically on first run.

### 2. Run the project
```bash
mvn spring-boot:run
```
Server starts at: `http://localhost:8080`

---

## 📌 All API Endpoints

### 🔓 Public Endpoints (No token needed)

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/admin/signup` | Register admin |
| POST | `/api/auth/admin/login` | Login → get JWT token |
| POST | `/api/teams/register` | Register a new team |
| GET | `/api/teams/{teamId}` | Get team details |
| GET | `/api/teams/{teamId}/score` | Get team scores |
| GET | `/api/leaderboard` | Get all teams sorted by score |
| GET | `/api/home/stats` | Get total/evaluated/pending counts |

### 🔐 Admin Endpoints (JWT token required)
Add header: `Authorization: Bearer <your-token>`

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/teams` | List all teams |
| GET | `/api/admin/teams/{teamId}` | Team details with marks |
| PUT | `/api/admin/teams/{teamId}/lock` | Lock a team |
| PUT | `/api/admin/students/{studentId}/evaluate` | Submit marks |
| GET | `/api/admin/students/{studentId}` | Get student details |

---

## 📝 Example Requests (use Postman)

### Register a Team
```json
POST /api/teams/register
{
  "teamName": "AlphaCoders",
  "members": [
    { "name": "Krishna", "rollNumber": "22CS101", "role": "Backend" },
    { "name": "Arun", "rollNumber": "22CS102", "role": "Frontend" }
  ]
}
```

### Admin Login
```json
POST /api/auth/admin/login
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```
Response: `{ "token": "eyJhbGc...", "role": "ADMIN" }`

### Submit Marks (use token in header)
```json
PUT /api/admin/students/1/evaluate
{
  "communication": 8,
  "technical": 9,
  "innovation": 7,
  "collaboration": 8,
  "presentation": 9
}
```

---

## 📁 Project Structure

```
src/main/java/com/evaluation/
├── EvaluationSystemApplication.java   ← Main class
├── model/
│   ├── Admin.java                     ← Admin entity (DB table)
│   ├── Team.java                      ← Team entity
│   └── Student.java                   ← Student entity
├── repository/
│   ├── AdminRepository.java           ← DB operations for Admin
│   ├── TeamRepository.java            ← DB operations for Team
│   └── StudentRepository.java         ← DB operations for Student
├── dto/
│   ├── RegisterTeamRequest.java       ← Request body for team register
│   ├── EvaluateStudentRequest.java    ← Request body for marks
│   ├── AdminSignupRequest.java        ← Request body for signup
│   └── AdminLoginRequest.java         ← Request body for login
├── service/
│   ├── AuthService.java               ← Business logic: login/signup
│   ├── TeamService.java               ← Business logic: teams
│   └── StudentService.java            ← Business logic: marks
├── controller/
│   ├── AuthController.java            ← /api/auth/** endpoints
│   ├── TeamController.java            ← /api/teams/** endpoints
│   └── AdminController.java           ← /api/admin/** endpoints
└── security/
    ├── JwtUtil.java                   ← Create & validate JWT tokens
    ├── JwtFilter.java                 ← Check token on each request
    └── SecurityConfig.java            ← Security rules (who can access what)
```

---

## 🔑 How JWT Works Here

1. Admin logs in → server creates a JWT token
2. Admin sends token in every request header: `Authorization: Bearer <token>`
3. JwtFilter checks the token and allows/blocks access
4. Token expires after 24 hours (86400000 ms)
