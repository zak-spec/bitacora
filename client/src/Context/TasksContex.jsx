import { createContext, useContext, useState } from 'react';
import { createTaskRequest, getTasksRequest } from '../Api/Tasks';

// Crear el contexto con un valor inicial por defecto
export const TasksContext = createContext({
  tasks: [],
  createTasks: () => {},
  getTasks: () => {}
});

// Mover el hook personalizado a una función componente
export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      console.log(res);
      setTasks(res.data); // Corregir para usar res.data
    } catch (error) {
      console.error(error);
    }
  };

  const createTasks = async (task) => {
    try {
      const response = await createTaskRequest(task);
      setTasks([...tasks, response.data]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, createTasks, getTasks }}>
      {children}
    </TasksContext.Provider>
  );
}