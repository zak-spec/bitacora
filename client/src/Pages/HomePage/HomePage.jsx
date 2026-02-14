import {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import './HomePage.css';
import { useAuth } from '../../Context/AuthContext';

const HomePage = () => {



const {isAuthenticated}=useAuth();
const [isLoading, setIsLoading] = useState(true);	


useEffect(() => {
  // Simular una llamada de autenticación
 const timer= setTimeout(() => {
    setIsLoading(false);
  }, 500); // Ajusta el tiempo según sea necesario
  return () => clearTimeout(timer);

}, []);

if (isLoading) {
  return <h1>Cargando...</h1>;
}

if (isAuthenticated&& !isLoading) {
  return <Navigate to="/tasks" />;
}

  return (
    <div>
      <Header
        title="Bitácora de Campo Botánica"
        subtitle="Sistema Digital de Registro para Investigación Botánica"
        backgroundImage="/images/botanical-bg.jpg"
      />
      <section className="quick-access">
        <h2>Acceso Rápido</h2>
        <div className="quick-access-grid">
          <div className="quick-card">
            <span className="icon">📝</span>
            <h3>Nuevo Registro</h3>
            <p>Iniciar una nueva entrada de campo</p>
          </div>
          <div className="quick-card">
            <span className="icon">🔍</span>
            <h3>Consultar Registros</h3>
            <p>Buscar en registros anteriores</p>
          </div>
          <div className="quick-card">
            <span className="icon">📊</span>
            <h3>Estadísticas</h3>
            <p>Ver resumen de muestreos</p>
          </div>
          <div className="quick-card">
            <span className="icon">📤</span>
            <h3>Exportar Datos</h3>
            <p>Descargar registros en CSV/PDF</p>
          </div>
        </div>
      </section>

      <section className="recent-activity">
        <h2>Actividad Reciente</h2>
        <div className="activity-timeline">
          <div className="activity-item">
            <div className="activity-date">22/03/2024</div>
            <div className="activity-content">
              <h4>Muestreo Bosque Nuboso</h4>
              <p>15 especímenes registrados</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-date">20/03/2024</div>
            <div className="activity-content">
              <h4>Actualización Taxonómica</h4>
              <p>Revisión de clasificaciones</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;