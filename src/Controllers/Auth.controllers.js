import User from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../Libs/jwt.js";

export const register = async (req, res) => {
  const { email, password, username, rol } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: passwordHash,
      username,
      rol
    });

    const userSave = await newUser.save();
    const token = await createAccessToken(userSave);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    });
    res.json({
      id: userSave._id,
      username: userSave.username,
      email: userSave.email,
      rol: userSave.rol,
      createdAt: userSave.createdAt,
      updatedAt: userSave.updatedAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const userFound=await User.findOne({email})
    if(!userFound) return res.status(400).json({message:"Usuario no encontrado"})
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({ message: "Credenciales incorrectas" });
  

   
    const token = await createAccessToken(userFound); // Espera a que se genere el token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    });
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      rol: userFound.rol,
      CreatedAt: userFound.createdAt,
      UpdatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
 };


 export const profile = async (req, res) => {
 const userFound= await User.findById(req.user.id);
if(!userFound) return res.status(400).json({message:"Usuario no encontrado"})
  return res.json(
    {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      rol: userFound.rol,
      CreatedAt: userFound.createdAt,
      UpdatedAt: userFound.updatedAt,
    }
  );
  res.send("Profile");
 };

 export const admin = async (req, res) => {
  res.send("Admin");
 };