import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <article className="blog-card">
      <div className="blog-card-image">
        <img src={blog.image} alt={blog.title} />
        <div className="blog-overlay">
          <i className="bi bi-calendar3"></i>
          <span>{formatDate(blog.date)}</span>
        </div>
      </div>
      <div className="blog-card-content">
        <div className="blog-category">
          <i className="bi bi-tag"></i>
          {blog.category}
        </div>
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-excerpt">{blog.content}</p>
        <Link to={blog.link} target="_blank" className="blog-card-btn">
          Leer más <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </article>
  );
}

