import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/cards/HeroSection';
import ContentSection from '../../components/cards/ContentSection';
import MissionSection from '../../components/cards/MissionSection';
import ValueCard from '../../components/cards/ValueCard';
import '../../styles/Nosotros.css';

export default function Nosotros() {
  const valores = [
    {
      icon: 'bi bi-bag-heart',
      title: 'Calidad Artesanal',
      description: 'Utilizamos técnicas tradicionales combinadas con ingredientes de la más alta calidad para garantizar que cada postre sea una obra de arte culinaria.'
    },
    {
      icon: 'bi bi-gem',
      title: 'Amor por el Detalle',
      description: 'Cada decoración, cada sabor, cada textura está cuidadosamente pensada para crear una experiencia sensorial completa que perdure en la memoria.'
    },
    {
      icon: 'bi bi-flower1',
      title: 'Ingredientes Frescos',
      description: 'Trabajamos con proveedores locales para asegurar la frescura de nuestros ingredientes, apoyando también a nuestra comunidad y garantizando sabores auténticos.'
    },
    {
      icon: 'bi bi-gift',
      title: 'Momentos Especiales',
      description: 'Entendemos que cada ocasión es única. Por eso, personalizamos nuestros productos para que cada celebración sea verdaderamente memorable.'
    },
    {
      icon: 'bi bi-people',
      title: 'Compromiso Familiar',
      description: 'Somos una empresa familiar que valora las tradiciones y el trabajo en equipo. Cada miembro de nuestro equipo comparte la misma pasión por la repostería.'
    },
    {
      icon: 'bi bi-lightbulb',
      title: 'Innovación Constante',
      description: 'Aunque respetamos las recetas tradicionales, siempre estamos innovando para ofrecer nuevas experiencias y sabores que sorprendan a nuestros clientes.'
    }
  ];

  const contenidoPrincipal = {
    title: 'Nuestra Pasión por la Repostería',
    paragraphs: [
      'Fundada con el sueño de llevar la dulzura a cada hogar, Mil Sabores nació de la pasión por crear postres que no solo deleiten el paladar, sino que también calienten el corazón.',
      'Cada receta que preparamos lleva consigo años de experiencia, ingredientes cuidadosamente seleccionados y, sobre todo, el amor que ponemos en cada preparación. Desde tortas clásicas hasta innovaciones modernas, cada producto refleja nuestro compromiso con la excelencia.',
      'Creemos que los momentos especiales merecen postres especiales. Por eso, trabajamos incansablemente para que cada celebración, cada cumpleaños, cada ocasión importante tenga el acompañamiento dulce perfecto.'
    ],
    image: '/img/equipo.jpg',
    imageAlt: 'Equipo de Mil Sabores trabajando'
  };

  return (
    <>
      <Header />
      <main className="main">
        <div className="nosotros-container">
          <HeroSection />
          
          <ContentSection 
            title={contenidoPrincipal.title}
            paragraphs={contenidoPrincipal.paragraphs}
            image={contenidoPrincipal.image}
            imageAlt={contenidoPrincipal.imageAlt}
          />

          <section className="nosotros-values">
            {valores.map((valor, index) => (
              <ValueCard 
                key={index}
                icon={valor.icon}
                title={valor.title}
                description={valor.description}
              />
            ))}
          </section>

          <MissionSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
