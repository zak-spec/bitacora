import React, { useEffect } from "react";
import { useTasks } from "../../Context/TasksContex";
import Card from "../../Components/Card/Card";
import "./TasksPage.css";
import { Link } from "react-router-dom";

function TasksPage() {
  const { tasks, getTasks } = useTasks();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await getTasks();
      } catch (error) {
        console.error(error);
      }
    };

    loadTasks();
  }, []); // Añadimos getTasks como dependencia

  return (
    <div className="bitacora-background min-h-screen py-12">
      <div className="bitacora-container mx-auto px-6 max-w-6xl">
        <h1 className="bitacora-title text-center">
          Registros de Muestreo Botánico
        </h1>

        {tasks.length > 0 &&
          tasks.map((task, index) => (
            <Link key={task._id} to={`/details/${task._id}`}>
              <Card task={task} index={index} />
            </Link>
          ))}
      </div>
    </div>
  );
}

export default TasksPage;
