# 🍳 Recipe Finder

A simple full-stack web app to search recipes, view details, and save favorites.

---

## 🚀 Features

- Search recipes by name or ingredients
- Filter by diet (vegetarian, gluten-free, etc.)
- View recipe details (ingredients, instructions)
- Save and manage favorite recipes
- Responsive design (mobile + desktop)

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite
- **API:** Spoonacular

---

## 📦 Installation

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/recipe-finder.git
cd recipe-finder
```

### 2. Setup backend

```bash
cd backend
npm install
cp .env.example .env
```

Add your Spoonacular API key in `.env`

### 3. Setup frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ Run the app

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## 📡 API (Basic)

- `GET /api/recipes/search?query=pizza`
- `GET /api/recipes/:id`
- `GET /api/favorites/:userId`
- `POST /api/favorites`

---

## 📁 Project Structure

```
backend/    # Express API
frontend/   # React app
```

---

## 🔮 Future Improvements

- User login/signup
- Meal planner
- Shopping list
- Recommendations

---

## 👨‍💻 Author

GitHub: https://github.com/Parvez152977/

---
