// Interfaces para la aplicación Bitácora

export interface IUser {
  _id: string;
  username: string;
  email: string;
  rol: 'administrador' | 'investigador' | 'colaborador';
  createdAt?: string;
  updatedAt?: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface ISpeciesDetail {
  scientificName: string;
  commonName: string;
  family: string;
  sampleQuantity: number;
  plantState: string;
  speciesPhotos: string[];
}

export interface ITask {
  _id: string;
  title: string;
  samplingDateTime: string;
  location: ILocation;
  weatherConditions: string;
  habitatDescription: string;
  samplingPhotos: string[];
  speciesDetails: ISpeciesDetail[];
  additionalObservations: string;
  user?: string;
  collaborators?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  rol?: string;
}

export interface ITaskFormData {
  title: string;
  samplingDateTime: string;
  location: ILocation;
  weatherConditions: string;
  habitatDescription: string;
  samplingPhotos: string[];
  speciesDetails: ISpeciesDetail[];
  additionalObservations: string;
}

export interface SearchFilters {
  dateRange: { start: string; end: string };
  location: { latitude: string; longitude: string };
  habitat: string;
  climate: string;
  species: string;
}
