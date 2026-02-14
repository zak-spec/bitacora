import { useState } from "react";
import { useTasks } from "../../Context/TasksContex";
import { useNavigate } from "react-router-dom";
import "./Collaborator.css";

function Collaborator() {
  const { getCollaborationTasks } = useTasks();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email.trim()) {
      setMessage("El correo es requerido");
      return;
    }

    try {
      const tasksData = await getCollaborationTasks(email);
      if (tasksData && tasksData.length > 0) {
        navigate("/tasks");
      } else {
        setMessage('No se encontraron tareas asociadas a este correo');
      }
    } catch (error) {
      setMessage("Error al buscar tareas. Intente de nuevo.");
    }
  };

  return (
    <div className="collaborator-container">
      <h2 className="collaborator-header">Verificación de Colaborador</h2>
      <form onSubmit={handleSubmit} className="collaborator-form">
        {message && (
          <div className="bg-yellow-100 text-yellow-800 p-3 mb-4 rounded text-sm">
            {message}
          </div>
        )}
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
