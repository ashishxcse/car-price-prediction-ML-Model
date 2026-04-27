

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)
# Load model and metadata
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, 'RandomForestModel.pkl')
metadata_path = os.path.join(BASE_DIR, 'metadata.pkl')

with open(model_path, 'rb') as f:
    model = pickle.load(f)

with open(metadata_path, 'rb') as f:
    metadata = pickle.load(f)

# Build car_names mapping from CSV if not already in metadata
if 'car_names' not in metadata:
    csv_path = os.path.join(BASE_DIR, '..', 'Cleaned_Car_data.csv')
    car_df = pd.read_csv(csv_path)
    car_names = {}
    for company in car_df['company'].unique():
        car_names[company] = sorted(car_df[car_df['company'] == company]['name'].unique().tolist())
    metadata['car_names'] = car_names


@app.route('/', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Car Price Prediction API is running'
    })


@app.route('/metadata', methods=['GET'])
def get_metadata():
    """Return available options for the form dropdowns"""
    return jsonify({
        'companies': metadata['companies'],
        'car_names': metadata['car_names'],
        'fuel_types': metadata['fuel_types'],
        'years': metadata['years'],
    })


@app.route('/models/<company>', methods=['GET'])
def get_models(company):
    """Return model names for a given company"""
    car_names = metadata.get('car_names', {})
    models = car_names.get(company, [])
    return jsonify({'company': company, 'models': models})


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict car price.
    
    Expected JSON body:
    {
        "name": "Maruti Suzuki Swift",
        "company": "Maruti",
        "year": 2015,
        "kms_driven": 30000,
        "fuel_type": "Petrol"
    }
    """
    data = request.get_json(force=True) 
    
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'company', 'year', 'kms_driven', 'fuel_type']
        missing = [f for f in required_fields if f not in data or data[f] is None]
        if missing:
            return jsonify({
                'error': True,
                'message': f'Missing required fields: {", ".join(missing)}'
            }), 400

        # Extract values
        name = str(data['name']).strip()
        company = str(data['company']).strip()
        fuel_type = str(data['fuel_type']).strip()

        try:
            year = int(data['year'])
        except (ValueError, TypeError):
            return jsonify({
                'error': True,
                'message': 'Year must be a valid integer'
            }), 400

        try:
            kms_driven = int(data['kms_driven'])
        except (ValueError, TypeError):
            return jsonify({
                'error': True,
                'message': 'Kilometres driven must be a valid number'
            }), 400

        if kms_driven < 0:
            return jsonify({
                'error': True,
                'message': 'Kilometres driven cannot be negative'
            }), 400

        # Create DataFrame for prediction
        input_df = pd.DataFrame({
            'name': [name],
            'company': [company],
            'year': [year],
            'kms_driven': [kms_driven],
            'fuel_type': [fuel_type]
        })

        # Predict
        prediction = model.predict(input_df)
        predicted_price = max(0, round(float(prediction[0]), 2))

        return jsonify({
            'error': False,
            'predicted_price': predicted_price,
            'formatted_price': f'₹ {predicted_price:,.2f}',
            'input': {
                'name': name,
                'company': company,
                'year': year,
                'kms_driven': kms_driven,
                'fuel_type': fuel_type
            }
        })

    except Exception as e:
        return jsonify({
            'error': True,
            'message': f'Prediction failed: {str(e)}'
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
