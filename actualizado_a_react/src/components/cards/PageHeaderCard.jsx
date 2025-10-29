import React from 'react';
import '../../styles/components/PageHeaderCard.css';

export default function PageHeaderCard({ title, subtitle, children, icon }) {
  return (
    <section className="page-header-card">
      <div className="page-header-content">
        <h1 className="page-header-title">
          {icon && <span className="page-header-icon" aria-hidden>{icon}</span>}
          {title}
        </h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
