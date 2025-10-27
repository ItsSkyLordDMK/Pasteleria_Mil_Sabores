import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../navigation/Sidebar';
import '../../styles/components/layouts/AdminLayout.css';

const AdminLayout = ({ children, title }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-layout__main">
        <header className="admin-layout__header">
          <h1 className="admin-layout__title">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default AdminLayout;