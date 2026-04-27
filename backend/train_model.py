"""
Train a Random Forest model for car price prediction.
Run this script once to generate RandomForestModel.pkl
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
import pickle
import os

# Load data
data_path = os.path.join(os.path.dirname(__file__), '..', 'Cleaned_Car_data.csv')
car = pd.read_csv(data_path)

# Select features and target
X = car[['name', 'company', 'year', 'kms_driven', 'fuel_type']]
y = car['Price']

# Define column transformer for preprocessing
categorical_features = ['name', 'company', 'fuel_type']
numeric_features = ['year', 'kms_driven']

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
        ('num', 'passthrough', numeric_features)
    ]
)

# Create pipeline with preprocessing + model
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(n_estimators=100, random_state=42, max_depth=15))
])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train
pipeline.fit(X_train, y_train)

# Evaluate
train_score = pipeline.score(X_train, y_train)
test_score = pipeline.score(X_test, y_test)
print(f"Train R² Score: {train_score:.4f}")
print(f"Test R² Score:  {test_score:.4f}")

# Save the pipeline (includes preprocessor + model)
model_path = os.path.join(os.path.dirname(__file__), 'RandomForestModel.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(pipeline, f)

print(f"\nModel saved to {model_path}")

# Also extract and save metadata for the frontend
# Build company -> model names mapping
car_names = {}
for company in car['company'].unique():
    names = sorted(car[car['company'] == company]['name'].unique().tolist())
    car_names[company] = names

metadata = {
    'companies': sorted(car['company'].unique().tolist()),
    'car_names': car_names,
    'fuel_types': sorted(car['fuel_type'].unique().tolist()),
    'years': sorted(car['year'].unique().tolist(), reverse=True),
}

metadata_path = os.path.join(os.path.dirname(__file__), 'metadata.pkl')
with open(metadata_path, 'wb') as f:
    pickle.dump(metadata, f)

print(f"Metadata saved to {metadata_path}")
