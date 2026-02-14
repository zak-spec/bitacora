import mongoose, { Schema } from "mongoose";
import type { IUserDocument } from "../types/index.js";

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      required: true,
      trim: true,
      enum: ["administrador", "investigador", "colaborador"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserDocument>("User", userSchema);
