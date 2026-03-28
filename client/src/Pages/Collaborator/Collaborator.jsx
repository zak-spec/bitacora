import { useState, useEffect } from "react";
import { useTasks } from "../../Context/TasksContex";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Collaborator.css";

function Collaborator() {
  const { getCollaborationTasks } = useTasks();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      console.log("El correo es requerido");
      return;
    }

    try {
      const tasksData = await getCollaborationTasks(email);
      if (tasksData && tasksData.length > 0) {
        navigate("/tasks");
      } else {
        console.log('No se encontraron tareas asociadas a este correo');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="collaborator-container">
      <h2 className="collaborator-header">Verificación de Colaborador</h2>
      <form onSubmit={handleSubmit} className="collaborator-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese su correo electrónico"
          className="email-search"
          required
        />
        <button type="submit" className="btn-verify">
          Verificar
        </button>
      </form>
    </div>
  );
}

export default Collaborator;
