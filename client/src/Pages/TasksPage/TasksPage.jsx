import React, { useEffect } from "react";
import { useTasks } from "../../Context/TasksContex";
import { useAuth } from "../../Context/AuthContext";
import Card from "../../Components/Card/Card";
import "./TasksPage.css";
import { Link } from "react-router-dom";

function TasksPage() {
  const { tasks, collaborationTasks, getTasks, getCollaborationTasks } = useTasks();
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (user.rol === 'colaborador') {
          await getCollaborationTasks(user.email);
        } else {
          await getTasks();
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadTasks();
  }, [user]); 

  // Esta línea es clave para entender la diferencia
  const tasksToDisplay = user.rol === 'colaborador' ? collaborationTasks : tasks;

  return (
    <div className="bitacora-background min-h-screen py-6 sm:py-12">
      <div className="bitacora-container mx-auto px-4 sm:px-6 max-w-6xl">
        <h1 className="bitacora-title text-center">
          {user.rol === 'colaborador' ? 'Bitácoras Colaborativas' : 'Registros de Muestreo Botánico'}
        </h1>

        {tasksToDisplay.length > 0 &&
          tasksToDisplay.map((task, index) => (
            <Card key={task._id} task={task} index={index} isCollaborator={user.rol === 'colaborador'} />
          ))}
      </div>
    </div>
  );
}

export default TasksPage;
