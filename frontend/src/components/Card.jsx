import React from 'react';
import './Card.css';

const Card = ({ title, value, unit = '' }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">
        {value !== null && value !== undefined ? value : '0'}
        {unit && <span className="card-unit">{unit}</span>}
      </p>
    </div>
  );
};

export default Card;