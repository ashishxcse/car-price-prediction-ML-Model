# 🚗 Car Price Predictor

AI-powered car price prediction using **Random Forest ML** with a **Flask REST API** backend and **React** frontend.

---

## 📁 Project Structure

```
car-price-project/
├── backend/
│   ├── app.py                  # Flask REST API
│   ├── train_model.py          # Model training script
│   ├── RandomForestModel.pkl   # Trained model
│   ├── metadata.pkl            # Dropdown options
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # App styles
│   │   ├── index.css           # Global styles
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── PredictionForm.jsx
│   │       └── PredictionResult.jsx
│   ├── index.html
│   └── package.json
├── Cleaned_Car_data.csv        # Source dataset
└── README.md
```

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python train_model.py          # Train the model (run once)
python app.py                  # Start Flask API on port 5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                    # Start dev server on port 5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint    | Description                  |
|--------|-------------|------------------------------|
| GET    | `/`         | Health check                 |
| GET    | `/metadata` | Get dropdown options (companies, years, fuel types) |
| POST   | `/predict`  | Predict car price            |

### POST `/predict` — Request Body

```json
{
  "name": "Maruti Suzuki Swift",
  "company": "Maruti",
  "year": 2015,
  "kms_driven": 30000,
  "fuel_type": "Petrol"
}
```

### Response

```json
{
  "error": false,
  "predicted_price": 325000.00,
  "formatted_price": "₹ 325,000.00",
  "input": { ... }
}
```

---

## 🏗️ Production Deployment

**Backend:**
```bash
cd backend
gunicorn app:app --bind 0.0.0.0:5000
```

**Frontend:**
```bash
cd frontend
VITE_API_URL=https://your-api-domain.com npm run build
# Serve the dist/ folder with any static host (Netlify, Vercel, etc.)
```

---

## 🛠️ Tech Stack

- **ML Model:** Random Forest (scikit-learn)
- **Backend:** Flask, Flask-CORS, Gunicorn
- **Frontend:** React, Vite
- **Styling:** Vanilla CSS (dark theme, glassmorphism)
