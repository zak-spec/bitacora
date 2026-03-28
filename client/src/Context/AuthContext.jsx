import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, registerRequest, verifyTokenRequest, logoutRequest, updateUserRequired, deleteUserRequired, getAllUsersRequired } from "../Api/Auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const getRedirectPath = (userRole) => {
    switch (userRole) {
      case "administrador":
        return "/users";
      case "colaborador":
        return "/collaborator";
      case "investigador":
        return "/tasks";
      default:
        return "/login";
    }
  };

  const signup = async (userData) => {
    try {
      const res = await registerRequest(userData);
      
      if (res.status === 200) {
        if (isAuthenticated && user?.rol === 'administrador') {
          // No actualizar el estado del usuario actual
          await getAllUsers(); // Actualizar solo la lista de usuarios
          return { success: true };
        }
        
        // Solo para registro normal
        setUser(res.data);
        setIsAuthenticated(true);
        return {
          success: true,
          redirectPath: getRedirectPath(res.data.rol)
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Error en signup:', error);
      setErrors(Array.isArray(error.response?.data) ? 
        error.response.data : 
        [error.response?.data?.message || "Error en el registro"]
      );
      return { success: false };
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
    
      
      if (!res || !res.data) {
        throw new Error("Invalid response from server");
      }
      setUser(res.data);
      setIsAuthenticated(true);
      
      return {
        success: true,
        redirectPath: getRedirectPath(res.data.rol)
      };
    } catch (error) {
      console.error("Signin error:", error);
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors(["Error de conexión con el servidor"]);
      }
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await logoutRequest();
      if (res.status === 200) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const res = await updateUserRequired(userId, userData);
      if (res.status === 200) {
        if (user && user._id === userId) {
          setUser(res.data);
        }
        return res.data;
      }
    } catch (error) {
      setErrors(error.response?.data || ["Error al actualizar usuario"]);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await deleteUserRequired(userId);
    setUsers(users.filter(userItem => userItem._id !== userId));
    } catch (error) {
      setErrors(error.response?.data || ["Error al eliminar usuario"]);
      throw error;
    }
  };

  const getAllUsers = async () => {
    console.log('Intentando obtener todos los usuarios');
    // Solo intentar obtener usuarios si el usuario actual es administrador
    if (!user || user.rol !== 'administrador') {
      console.log('Usuario no autorizado para obtener lista de usuarios');
      setUsers(null);
      return;
    }
    
    try {
      console.log('Solicitando lista de usuarios...');
      const res = await getAllUsersRequired();
      if (res.data) {
        console.log('Usuarios obtenidos:', res.data);
        setUsers(res.data.filter(userItem => 
          userItem._id !== user._id && userItem.rol !== 'administrador'
        ));
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsers(null);
      // No lanzar el error, solo registrarlo
    }
  };

  useEffect(() => {
    async function checkLogin() {
      console.log('Verificando token de autenticación...');
      try {
        const res = await verifyTokenRequest();
        console.log('Respuesta de verificación:', res);
        
        if (res && res.data) {
          console.log('Usuario autenticado:', res.data);
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error en verificación de token:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user?.rol === 'administrador') {
        try {
          const res = await getAllUsersRequired();
          if (res.data) {
            console.log('Actualizando lista de usuarios');
            setUsers(res.data.filter(userItem => 
              userItem._id !== user._id && userItem.rol !== 'administrador'
            ));
          }
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
          if (error.response?.status === 401) {
            await verifyTokenRequest(); // Intentar renovar el token
          }
        }
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        loading,
        errors,
        updateUser,
        deleteUser,
        getAllUsers,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;