from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Car Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # development ke liye "*" theek hai; production mein specific domain daalo
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model loading — ek baar, jab file import hoti hai
model = joblib.load("ml_model/model.pkl")
encoder = joblib.load("ml_model/encoders.pkl")
scaler = joblib.load("ml_model/scaler.pkl")
feature_columns = joblib.load("ml_model/feature_columns.pkl")

CATEGORICAL_COLS = feature_columns["categorical_cols"]
NUMERIC_COLS = feature_columns["numeric_cols"]


class CarInput(BaseModel):
    Brand: str
    fuel: str
    transmission: str
    owner: int
    km_driven: int
    mileage: float
    engine: float
    car_age: int


@app.post("/api/predict/")
def predict_price(data: CarInput):
    cat_input = [[getattr(data, col) for col in CATEGORICAL_COLS]]
    num_input = [[getattr(data, col) for col in NUMERIC_COLS]]

    try:
        cat_encoded = encoder.transform(cat_input)
    except ValueError:
        raise HTTPException(status_code=400, detail="Unknown Brand/fuel/transmission value")

    num_scaled = scaler.transform(num_input)
    final_input = np.hstack([cat_encoded, num_scaled])

    predicted_price = model.predict(final_input)[0]
    return {"predicted_price": round(float(predicted_price), 2)}