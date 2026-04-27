import { useState, useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * PredictionForm - handles all form inputs and API call
 */
function PredictionForm({ metadata, onResult, onError, onLoading }) {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    year: '',
    kms_driven: '',
    fuel_type: '',
  });

  const [loading, setLoading] = useState(false);

  // Get model names for the selected company
  const availableModels = useMemo(() => {
    if (!formData.company || !metadata.car_names) return [];
    return metadata.car_names[formData.company] || [];
  }, [formData.company, metadata.car_names]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'company') {
      // Reset model name when company changes
      setFormData((prev) => ({ ...prev, company: value, name: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.company || !formData.name || !formData.year || !formData.kms_driven || !formData.fuel_type) {
      onError('Please fill in all fields');
      return;
    }

    if (Number(formData.kms_driven) < 0) {
      onError('Kilometres driven cannot be negative');
      return;
    }

    setLoading(true);
    onLoading(true);
    onError(null);
    onResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          year: parseInt(formData.year),
          kms_driven: parseInt(formData.kms_driven),
          fuel_type: formData.fuel_type,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        onError(data.message || 'Something went wrong');
      } else {
        onResult(data);
      }
    } catch (err) {
      onError('Unable to connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} id="prediction-form">
      {/* Company */}
      <div className="form-group">
        <label className="form-label" htmlFor="company">Company</label>
        <select
          className="form-select"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a company</option>
          {metadata.companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Car Model — dependent on company */}
      <div className="form-group">
        <label className="form-label" htmlFor="name">Car Model</label>
        <select
          className="form-select"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={!formData.company}
        >
          <option value="" disabled>
            {formData.company ? 'Select a model' : 'Select a company first'}
          </option>
          {availableModels.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div className="form-group">
        <label className="form-label" htmlFor="year">Year of Purchase</label>
        <select
          className="form-select"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select year</option>
          {metadata.years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Fuel Type */}
      <div className="form-group">
        <label className="form-label" htmlFor="fuel_type">Fuel Type</label>
        <select
          className="form-select"
          id="fuel_type"
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select fuel type</option>
          {metadata.fuel_types.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Kilometres Driven */}
      <div className="form-group">
        <label className="form-label" htmlFor="kms_driven">Kilometres Driven</label>
        <input
          className="form-input"
          type="number"
          id="kms_driven"
          name="kms_driven"
          value={formData.kms_driven}
          onChange={handleChange}
          placeholder="e.g. 35000"
          min="0"
          required
        />
      </div>

      {/* Submit Button */}
      <button className="btn-predict" type="submit" disabled={loading} id="predict-btn">
        <span className="btn-content">
          {loading && <span className="spinner" />}
          {loading ? 'Predicting...' : 'Predict Price'}
        </span>
      </button>
    </form>
  );
}

export default PredictionForm;
