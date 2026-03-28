import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="leaf-pattern"></div>
      <div className="about-content">
        <h1>Bitácora de Campo Botánica</h1>
        <div className="mission-statement">
          <p>
            Sistema digital especializado para el registro y documentación de muestreos botánicos
            en campo, diseñado para investigadores, estudiantes y profesionales en botánica.
            Una herramienta esencial para la investigación científica y catalogación de especies.
          </p>
        </div>

        <section className="features">
          <h2>Capacidades del Sistema</h2>
          <ul>
            <li>Registro detallado de especímenes botánicos</li>
            <li>Geolocalización precisa de muestras</li>
            <li>Documentación fotográfica con escala</li>
            <li>Clasificación taxonómica estructurada</li>
            <li>Registro de condiciones ambientales</li>
            <li>Exportación de datos en formatos científicos</li>
            <li>Colaboración entre equipos de investigación</li>
          </ul>
        </section>

        <section className="methodology">
          <h2>Metodología de Registro</h2>
          <div className="methodology-grid">
            <div className="method-card">
              <h3>Datos de Campo</h3>
              <ul>
                <li>Coordenadas GPS</li>
                <li>Altitud y orientación</li>
                <li>Tipo de suelo</li>
                <li>Condiciones climáticas</li>
              </ul>
            </div>
            <div className="method-card">
              <h3>Datos Botánicos</h3>
              <ul>
                <li>Taxonomía completa</li>
                <li>Estado fenológico</li>
                <li>Características morfológicas</li>
                <li>Interacciones ecológicas</li>
              </ul>
            </div>
            <div className="method-card">
              <h3>Documentación</h3>
              <ul>
                <li>Fotografías técnicas</li>
                <li>Notas de campo</li>
                <li>Referencias cruzadas</li>
                <li>Códigos de colecta</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="institutional">
          <h2>Información Institucional</h2>
          <div className="contact-info">
            <p>Departamento de Botánica - Universidad Nacional</p>
            <p>Email: herbario@universidad.edu</p>
            <p>Tel: (123) 456-7890</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
