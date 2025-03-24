# 🎓 Techno International Batanagar Exam Portal

A fully functional **Exam Portal** built using **ReactJS** and **Firebase**.  
The portal includes two panels:
- **Admin Panel**: For managing exams, students, results, and announcements.
- **Student Panel**: For students to register, take exams, view results, and receive updates.

---

## 🚀 Features

### 🛠️ Admin Panel:
- Secure Admin Login (Firebase Authentication)
- Create, Update & Delete Exams
- Manage Students (Add/Remove)
- Publish Results
- Send Notifications & Announcements
- Real-time Database Management

### 🎓 Student Panel:
- Student Registration & Login
- View Upcoming & Ongoing Exams
- Take Online Exams (MCQs, Descriptive, etc.)
- View Exam Results
- Receive Notifications & Announcements

---

## 🏗️ Tech Stack

- **Frontend:** ReactJS, Tailwind CSS / Bootstrap
- **Backend:** Firebase Authentication, Firebase Firestore Database, Firebase Storage
- **Hosting:** Firebase Hosting

---

## 📂 Folder Structure

```
/exam-portal
├── /public
├── /src
│   ├── /components
│   │   ├── /Admin
│   │   └── /Student
│   ├── /pages
│   │   ├── AdminDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── Login.jsx
│   ├── /firebase
│   │   └── firebaseConfig.js
│   ├── App.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Authentication

- **Admin & Students**: Login secured using **Firebase Authentication (Email/Password)**.
- Role-based access: Admins and Students have separate dashboard access.

---

## 📝 How to Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/exam-portal.git
   cd exam-portal
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** (Email/Password)
   - Setup **Firestore Database** and **Storage**
   - Get your Firebase config and replace it in `/src/firebase/firebaseConfig.js`

4. **Run the App:**
   ```bash
   npm start
   ```

---

## 🌐 Live Demo

🚧 _Will be added after deployment_  
Firebase Hosting link: _Coming soon_

---

## 📸 Screenshots

available soon..........

---

## 📄 License

This project is developed for **Techno International Batanagar** and is meant for educational use.

---

## 🤝 Contributors

- **Vivek dasvivek398@gmail.com ** - Developer  
_(Feel free to add others if applicable)_

