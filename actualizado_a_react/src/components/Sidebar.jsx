import React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          <img
            src="/assets/img/logo.svg"
            alt="Logo"
            style={{ height: 36, width: 36, borderRadius: '50%', boxShadow: '0 2px 8px #f3e6d8' }}
          />
          Mil Sabores
        </div>
        <nav>
          <a href="#"><i className="bi bi-grid-1x2"></i> Dashboard</a>
          <a href="#"><i className="bi bi-bag"></i> Orders</a>
          <a href="#"><i className="bi bi-box"></i> Inventory</a>
          <a href="#"><i className="bi bi-bar-chart"></i> Reports</a>
          <a href="#"><i className="bi bi-people"></i> Employees</a>
          <a href="#" className="active"><i className="bi bi-person-lines-fill"></i> Customers</a>
        </nav>
        {/* bottom menu intentionally left out for simplicity */}
      </div>
      <div className="profile"><i className="bi bi-person-circle"></i> Admin</div>
    </aside>
  );
}
