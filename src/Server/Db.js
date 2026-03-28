import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://zak:uXtjVjeSWTYGMNmh@cluster0.ru6wu.mongodb.net/");
  } catch (error) {
    console.error("Error: ", error);
  }
};
