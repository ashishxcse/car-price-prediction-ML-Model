import { Building2, Calendar, Fuel, GaugeCircle, TrendingUp } from 'lucide-react';

/**
 * PredictionResult - displays the predicted price with details,
 * or a subtle empty state when no prediction has been made yet.
 */
function PredictionResult({ result }) {
  if (!result) {
    return (
      <div className="result-empty" id="prediction-placeholder">
        <div className="result-empty-icon">
          <TrendingUp size={40} strokeWidth={1} />
        </div>
        <p>Fill in the details and hit predict<br />to see the estimated value here.</p>
      </div>
    );
  }

  const { formatted_price, input } = result;

  return (
    <div className="result-card" id="prediction-result">
      <p className="result-label">Estimated Market Value</p>
      <p className="result-price">{formatted_price}</p>
      <div className="result-details">
        <span className="result-tag">
          <span className="result-tag-icon"><Building2 size={14} strokeWidth={1.5} /></span>
          {input.company}
        </span>
        <span className="result-tag">
          <span className="result-tag-icon"><Calendar size={14} strokeWidth={1.5} /></span>
          {input.year}
        </span>
        <span className="result-tag">
          <span className="result-tag-icon"><Fuel size={14} strokeWidth={1.5} /></span>
          {input.fuel_type}
        </span>
        <span className="result-tag">
          <span className="result-tag-icon"><GaugeCircle size={14} strokeWidth={1.5} /></span>
          {input.kms_driven.toLocaleString()} km
        </span>
      </div>
    </div>
  );
}

export default PredictionResult;
