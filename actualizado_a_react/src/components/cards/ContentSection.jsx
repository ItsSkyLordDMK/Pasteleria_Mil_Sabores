import React from 'react';

export default function ContentSection({ title, paragraphs, image, imageAlt, reverse = false }) {
  return (
    <section className={`nosotros-content ${reverse ? 'reverse' : ''}`}>
      <div className="nosotros-image">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="nosotros-text">
        <h2>{title}</h2>
        {paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>
    </section>
  );
}

