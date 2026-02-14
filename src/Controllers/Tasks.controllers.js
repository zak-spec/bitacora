import Task from "../Models/Task.model.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).populate("user");
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener las tareas", error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      samplingDateTime,
      location,
      weatherConditions,
      habitatDescription,
      samplingPhotos,
      speciesDetails,
      additionalObservations,
    } = req.body;

    // Asegurar que la fecha es válida
    const dateObj = new Date(samplingDateTime);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    const newTask = new Task({
      title,
      samplingDateTime: dateObj,
      location: {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      },
      weatherConditions,
      habitatDescription,
      samplingPhotos,
      speciesDetails: speciesDetails.map((species) => ({
        ...species,
        sampleQuantity: Number(species.sampleQuantity),
      })),
      user: req.user.id,
      additionalObservations,
    });

    await newTask.save();
    res.json(newTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear la tarea", error: error.message });
  }
};

export const getTask = async (req, res) => {
  try{
    const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task no encontrado" });
  res.json(task);
  
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener la tarea", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task no encontrado" });

    // Verificar que el usuario sea el dueño de la tarea
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permisos para eliminar esta tarea" });
    }

    await Task.findByIdAndDelete(req.params.id);
    return res.json({ message: "Task eliminado" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al eliminar la tarea", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskExists = await Task.findById(req.params.id);
    if (!taskExists) return res.status(404).json({ message: "Task no encontrado" });

    // Verificar que el usuario sea el dueño de la tarea
    if (taskExists.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permisos para actualizar esta tarea" });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la tarea", error: error.message });
  }
};


