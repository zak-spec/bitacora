import { createContext, useState, useContext } from "react";
import { registerRequest } from "../Api/Auth";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro del proveedor AuthContext");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState([]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res);
      setUser(res.data); // Asegúrate de acceder a los datos correctamente
      setIsAuthenticated(true);
      setError([]); // Limpia los errores en caso de éxito
    } catch (error) {
      setError(error.response.data); // Asegúrate de que los errores se almacenen como un array
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        user,
        isAuthenticated,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};