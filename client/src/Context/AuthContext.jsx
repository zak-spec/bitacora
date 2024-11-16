import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, registerRequest, verifyTokenRequest,logoutRequest } from "../Api/Auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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


  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log("user:", user);
      console.log("res:", res.Cookies);
      
      if (!res || !res.data) {
        throw new Error("Invalid response from server");
      }
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      console.error("Signin error:", error);
      setErrors(error.response.data);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res=logoutRequest();
      console.log("res:", res);
      
      if (res.status === 200) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error.response.data);
    }

   
  };

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await verifyTokenRequest();
        
        if (res && res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;