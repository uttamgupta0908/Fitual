# 🏋️‍♀️ Fitual – Fitness App (React Native)

Fitual is a modern fitness app built with **React Native CLI**, designed to help users explore exercises, track workouts, and stay healthy.

## 🚀 Features

- 🏃 Browse exercises by muscle group & difficulty
- 🎯 Filter by equipment and workout goal
- 🧠 Smart backend with Prisma + MySQL
- 🔒 Authentication system (custom or JWT-based)
- 📱 Built using React Native CLI

---

## 🧑‍💻 Tech Stack

- **Frontend**: React Native, TypeScript
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: MySQL
- **API**: RESTful
- **Authentication**: JWT (custom middleware)

---

## 🛠️ Getting Started

### 📦 Install Dependencies

```sh
npm install
npm start
npm run android
npm run ios
```

## Backend Setup (Node + Prisma + MySQL)

```sh
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 🗄️ Database Configuration

```env
DATABASE_URL="mysql://user:password@localhost:3306/fitual"
JWT_SECRET="your_jwt_secret"
```

### 📸 UI Preview

Coming Soon... (You can add screenshots here)

🙌 Credits
Fitual is crafted with ❤️ by [Your Name]
Icons powered by Lucide Icons
Inspiration from modern fitness UIs.

## 📄 License

---

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Let me know if you want sections like:

- GitHub badges
- API documentation
- Contributor guide
- Deployment instructions (Expo / EAS)

I can include those too.
