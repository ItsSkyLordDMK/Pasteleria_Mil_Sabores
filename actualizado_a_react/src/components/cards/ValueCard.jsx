import React from 'react';

export default function ValueCard({ icon, title, description }) {
  return (
    <div className="value-card">
      <h3>
        <i className={icon} style={{ marginRight: '8px' }}></i>
        {title}
      </h3>
      <p>{description}</p>
    </div>
  );
}

