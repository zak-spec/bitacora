import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTasks } from '../../Context/TasksContex'
import Details from '../../Components/Details/Details'

const DetailsPage = () => {
  const { id } = useParams();
  const { getTask } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskData = await getTask(id);
        setTask(taskData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [id]);

  if (loading) return <div className="text-center py-8">Cargando...</div>
  if (!task) return <div className="text-center py-8">No se encontró la bitácora</div>

  return (
    <div className="bitacora-background min-h-screen py-12">
      <div className="bitacora-container mx-auto px-6 max-w-6xl">
        <h1 className="bitacora-title text-center">Detalles de la Bitácora</h1>
        <Details task={task} />
      </div>
    </div>
  )
}

export default DetailsPage
