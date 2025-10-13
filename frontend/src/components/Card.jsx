// src/components/Card.jsx
import React from 'react';
import './Card.css';

function Card({ title, value, icon }) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <h3 className="card-value">{value}</h3>
      </div>
    </div>
  );
}

export default Card;