import { Document, Types } from "mongoose";

// ── Interfaces de dominio ──

export interface IUser {
  username: string;
  email: string;
  password: string;
  rol: "administrador" | "investigador" | "colaborador";
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpeciesDetail {
  scientificName: string;
  commonName: string;
  family: string;
  sampleQuantity: number;
  plantState: string;
  speciesPhotos: string[];
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface ITask {
  title: string;
  samplingDateTime: Date;
  location: ILocation;
  weatherConditions: string;
  habitatDescription: string;
  samplingPhotos: string[];
  speciesDetails: ISpeciesDetail[];
  additionalObservations?: string;
  collaborators: Types.ObjectId[];
  user: Types.ObjectId;
}

export interface ITaskDocument extends ITask, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ── Interfaces para JWT ──

export interface JwtPayload {
  id: string;
  rol: string;
}

// ── Express augmentation ──

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
