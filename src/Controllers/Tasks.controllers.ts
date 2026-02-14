import type { Request, Response } from "express";
import Task from "../Models/Task.model.js";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ user: req.user!.id }).populate("user");
    res.send(tasks);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
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

    const dateObj = new Date(samplingDateTime);
    if (isNaN(dateObj.getTime())) {
      res.status(400).json({ message: "Fecha inválida" });
      return;
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
      speciesDetails: speciesDetails.map((species: any) => ({
        ...species,
        sampleQuantity: Number(species.sampleQuantity),
      })),
      user: req.user!.id,
      additionalObservations,
    });

    await newTask.save();
    res.json(newTask);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la tarea", error: error.message });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task no encontrado" });
      return;
    }
    res.json(task);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la tarea", error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task no encontrado" });
      return;
    }

    if (task.user.toString() !== req.user!.id) {
      res.status(403).json({ message: "No tienes permisos para eliminar esta tarea" });
      return;
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task eliminado" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskExists = await Task.findById(req.params.id);
    if (!taskExists) {
      res.status(404).json({ message: "Task no encontrado" });
      return;
    }

    if (taskExists.user.toString() !== req.user!.id) {
      res.status(403).json({ message: "No tienes permisos para actualizar esta tarea" });
      return;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
  }
};
