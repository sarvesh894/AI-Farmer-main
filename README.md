# 🌿 AI Farmer

An AI-powered integrated crop advisory system built with React and Firebase. Helps farmers make smarter decisions using machine learning for crop recommendations, fertilizer suggestions, and plant disease detection.

🔗 **Live Demo:** [https://agri-farm-ai.vercel.app/](https://agri-farm-ai.vercel.app/)

---

## Features

| Feature | Description |
|---|---|
| 🌾 Crop Recommendation | Predicts the best crop based on soil nutrients, temperature, humidity, pH, and rainfall |
| 💧 Fertilizer Recommendation | Suggests optimal fertilizer based on soil type, crop type, and nutrient levels |
| 🔬 Disease Detection | Upload a plant image to detect diseases and get treatment suggestions |
| 📊 History | Saves all predictions per user with filter and PDF export |
| 📈 Market Prices | Live indicative crop prices with trend charts and category filters |
| 🧮 Soil Health Calculator | Calculates soil health score with improvement tips |
| 📅 Crop Calendar | Seasonal planting and harvesting guide for 12+ major crops |
| 🌤️ Weather Widget | Real-time weather using geolocation (Open-Meteo API) |
| 🔐 Authentication | Firebase email/password sign in and sign up |
| ⚙️ Settings | Update profile, change password, toggle dark mode, manage notifications |
| 🌙 Dark Mode | Full dark/light theme toggle |

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Auth & Database:** Firebase (Authentication + Firestore)
- **ML APIs:** FastAPI (Python) hosted on Render
- **ML Models:** MobileNetV2 (disease detection), scikit-learn (crop & fertilizer)
- **Deployment:** Vercel

---

## Getting Started

```bash
# Install dependencies
cd croprecommender
npm install

# Add Firebase config to .env
cp .env.example .env
# Fill in your Firebase credentials

# Start development server
npm start
```

### Environment Variables

Create a `.env` file in the `croprecommender` directory:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## ML Model Setup (Disease Detection)

```bash
cd ML_MODEL/DiseaseAPI

# Install dependencies
pip install -r requirements.txt

# Train the model (one-time, downloads Kaggle dataset)
python3 train_model.py

# Start the API
python3 app.py
# Runs on http://127.0.0.1:8002
```

Dataset: [New Plant Diseases Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) — 38 classes, 70,000+ images

---

## Project Structure

```
croprecommender/
├── src/
│   ├── components/       # Logo, WeatherWidget
│   ├── pages/            # All page components
│   ├── utils/            # Predictors, PDF generator, history saver
│   ├── App.js            # Routes and auth state
│   ├── firebase.js       # Firebase config
│   └── App.css           # Global eco-friendly styles
├── public/
└── ML_MODEL/
    ├── API/              # Crop recommendation API
    ├── FertAPI/          # Fertilizer recommendation API
    └── DiseaseAPI/       # Plant disease detection API
```

---

## Developed by

**Awanit Kumar Singh**  
Final Year CSE — Lovely Professional University, Punjab  
📧 awanitsingh8873@gmail.com  
🐙 [github.com/awanitsingh](https://github.com/awanitsingh)
