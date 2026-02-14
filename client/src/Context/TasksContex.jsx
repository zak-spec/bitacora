import { createContext, useContext, useState, useEffect } from 'react';
import { createTaskRequest, getTasksRequest, getTaskRequest,deleteTaskRequest,updateTaskRequest} from '../Api/Tasks';
import {exportFormatoCSV,exportFormatoPDF} from '../Api/Formato';
import { getTasksByEmail } from '../Api/Collaborator';


// Crear el contexto con un valor inicial por defecto
export const TasksContext = createContext({
  tasks: [],
  createTasks: () => {},
  getTasks: () => {},
  exportToPDF: () => {},
  exportToCSV: () => {}
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
  const [collaborationTasks, setCollaborationTasks] = useState([]);

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data; // Retornamos directamente los datos en lugar de guardarlos en el estado
    } catch (error) {
      console.error(error);
      return null;
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

const deleteTask = async (id) => {
  try {
    const res = await deleteTaskRequest(id);
    if (res.status === 200) {
      setTasks(tasks.filter((task) => task._id !== id));
    }
  } catch (error) {
    console.error(error);
  }
};

const updateTask = async (id, task) => {
  try {
    const res = await updateTaskRequest(id, task);
    if (res.status === 200) {
      setTasks(tasks.map((t) => t._id === id ? res.data : t));
    }
  } catch (error) {
    console.error(error);
  }
};  

  const exportToPDF = async (task) => {
    try {
      await exportFormatoPDF(task._id);
      // Opcional: Mostrar notificación de éxito
      alert('PDF exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al exportar PDF');
    }
  };

  const exportToCSV = async (task) => {
    try {
      await exportFormatoCSV(task._id);
      // Opcional: Mostrar notificación de éxito
      alert('CSV exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar CSV');
    }
  };

  const getCollaborationTasks = async (email) => {
    try {
      const res = await getTasksByEmail(email);
      const tasksData = res.data;
      
      if (Array.isArray(tasksData) && tasksData.length > 0) {
        setCollaborationTasks(tasksData);
        setTasks(prevTasks => {
          const combinedTasks = [...prevTasks];
          tasksData.forEach(newTask => {
            if (!combinedTasks.find(task => task._id === newTask._id)) {
              combinedTasks.push(newTask);
            }
          });
          return combinedTasks;
        });
        return tasksData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching collaboration tasks:', error);
      throw error;
    }
  };

  // Solo mantenemos un useEffect para cargar las tareas iniciales
  useEffect(() => {
    getTasks();

  }, []);

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      collaborationTasks, // Nuevo valor
      createTasks, 
      getTasks, 
      getTask, 
      deleteTask, 
      updateTask,
      exportToPDF,
      exportToCSV,
      getCollaborationTasks, // Nueva función
    }}>
      {children}
    </TasksContext.Provider>
  );
}