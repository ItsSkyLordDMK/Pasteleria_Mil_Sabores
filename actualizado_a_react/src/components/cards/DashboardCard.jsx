import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/DashboardCard.css';

const DashboardCard = ({ title, value, subtitle, backgroundColor }) => {
  return (
    <div className="dashboard-card" style={{ backgroundColor }}>
      <h3 className="dashboard-card__title">{title}</h3>
      <div className="dashboard-card__value">{value}</div>
      <p className="dashboard-card__subtitle">{subtitle}</p>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default DashboardCard;