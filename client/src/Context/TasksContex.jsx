import { createContext, useContext, useState } from 'react';
import { createTaskRequest, getTasksRequest, getTaskRequest,deleteTaskRequest,updateTaskRequest} from '../Api/Tasks';

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
  try{
    const res=await deleteTaskRequest(id);
    console.log(res);
    
    if(res.status===200){
      console.log('Task deleted');
      
      setTasks(tasks.filter((task)=>task._id!==id));
    }

  } catch(error){
    console.error(error);
  }
};
const updateTask = async (id,task) => {
  try{
    const res=await updateTaskRequest(id,task);
    console.log(res);
    
    if(res.status===200){
      console.log('Task updated');
      setTasks(tasks.map((task)=>task._id===id?res.data:task));
    }

  } catch(error){
    console.error(error);
  }
};  
  return (
    <TasksContext.Provider value={{ tasks, createTasks, getTasks,getTask,deleteTask,updateTask }}>
      {children}
    </TasksContext.Provider>
  );
}