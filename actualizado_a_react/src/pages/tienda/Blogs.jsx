import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogCard from '../../components/BlogCard';
import '../../styles/Blogs.css';

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      title: '¿Sabías que el pastel más largo del mundo fue hecho en India?',
      content: 'El pastel más largo mide 5300 m (17388 pies) y fue logrado por la Bakers Association Kerala (India) en Thrissur, Kerala, India, el 15 de enero de 2020. ¡El pastel fue terminado en 10 minutos por la multitud que esperaba!',
      date: '2020-01-15',
      category: 'Curiosidades',
      image: '/img/pastel mas largo del mundo.jpg',
      link: 'https://www.guinnessworldrecords.com/world-records/longest-cake'
    },
    {
      id: 2,
      title: 'La historia del tiramisú',
      content: 'El tiramisú, uno de los postres más famosos de Italia, nació en la región de Véneto en los años 60. Su nombre significa "levántame el ánimo" y combina café, queso mascarpone y cacao.',
      date: '2025-09-10',
      category: 'Recetas',
      image: '/img/tiramisu.avif',
      link: 'https://lamafia.es/blog/curiosidades-del-tiramisu-el-postre-italiano-mas-conocido'
    },
    {
      id: 3,
      title: '¿Por qué los pasteles de cumpleaños llevan velas?',
      content: 'La inclusión de velas en los pasteles también tiene una historia rica y simbólica. En la antigua Grecia, las velas eran consideradas símbolos de la luna y se creía que tenían un poder mágico. Al colocar velas en los pasteles, se buscaba invocar la protección de los dioses.',
      date: '2024-01-25',
      category: 'Tradiciones',
      image: '/img/pastel de cumpleaños.jpg',
      link: 'https://oem.com.mx/tribunadesanluis/tendencias/conoce-el-origen-y-significado-del-pastel-y-velas-para-celebrar-un-cumpleanos-13159146'
    }
  ];

  return (
    <>
      <Header />
      <main className="blog-main">
        <section className="blog-hero">
          <div className="blog-hero-content">
            <h1 className="blog-hero-title">
              <i className="bi bi-cup-hot-fill"></i>
              Blog de Repostería
            </h1>
            <p className="blog-hero-subtitle">
              Descubre datos curiosos, historias dulces y técnicas secretas sobre el mundo de la pastelería
            </p>
          </div>
        </section>

        <div className="blog-container">
          <div className="blog-grid">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
