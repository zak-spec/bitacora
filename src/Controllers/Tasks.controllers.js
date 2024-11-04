import Task from "../Models/Task.model.js";
export const getTasks = async (req, res) => {
  const tasks = await Task.find({
    user: req.user.id
  }).populate("user");
  res.send(tasks);
  // Your code here
};

export const createTask = async (req, res) => {
const { title, location, weatherConditions, habitatDescription, samplingPhotos, speciesDetails, additionalObservations } = req.body;
  const newTask = new Task({
    title,
    location,
    weatherConditions,
    habitatDescription,
    samplingPhotos,
    speciesDetails,
    user: req.user.id,
    additionalObservations
  });
    await newTask.save();
    res.json(newTask);
};

export const getTask = async (req, res) => {
const task=await Task.findById(req.params.id);
if (!task) return res.status(404).json({ message: "Task no encontrado" });
res.json(task);
};


export const deleteTask = async (req, res) => {
 const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task no encontrado" });
  return res.json({ message: "Task eliminado" });
};

export const updateTask = async (req, res) => {
const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!task) return res.status(404).json({ message: "Task no encontrado" });
res.json(task);
};