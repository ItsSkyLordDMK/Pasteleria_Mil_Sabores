import React from 'react';

export default function MissionSection() {
  return (
    <section className="nosotros-content reverse">
      <div className="nosotros-image">
        <img src="/img/mision.jpg" alt="Nuestra misión en Mil Sabores" />
      </div>
      <div className="nosotros-text">
        <h2>Nuestra Misión</h2>
        <p>
          Crear momentos de felicidad a través de postres excepcionales que combinen tradición e innovación, 
          utilizando ingredientes de calidad y técnicas artesanales que han sido perfeccionadas a lo largo de los años.
        </p>
        <h2>Nuestra Visión</h2>
        <p>
          Ser reconocidos como la pastelería líder en la región, siendo el destino preferido para quienes 
          buscan calidad, sabor y experiencia en cada bocado. Aspiramos a ser parte de los momentos más importantes 
          de las familias de nuestra comunidad.
        </p>
      </div>
    </section>
  );
}

