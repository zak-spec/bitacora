import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, isAuthenticated, errors: signinErrors, rol } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && rol) {
      const redirectPath = 
        rol === "administrador" ? "/users" :
        rol === "colaborador" ? "/collaborator" : "/tasks";
      navigate(redirectPath);
    }
  }, [isAuthenticated, rol, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await signin(data);
      if (result.success) {
        navigate(result.redirectPath);
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  });

  // Si ya está autenticado, no renderizar el formulario
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen login-background">
      <div className="w-full max-w-md p-8 m-4 rounded-xl login-card">
        {signinErrors && signinErrors.length > 0 && signinErrors.map((error, index) => (
          <div key={index} className="flex items-center gap-2 p-3 mb-4 rounded-lg error-message">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        ))}
        
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Bienvenido de nuevo
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                id="email"
                {...register("email", { required: "El email es obligatorio" })}
                className="w-full pl-10 pr-4 py-3 rounded-lg input-field"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1 error-text">
                <FaExclamationCircle className="text-xs" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaLock />
              </span>
              <input
                type="password"
                id="password"
                {...register("password", { required: "La contraseña es obligatoria" })}
                className="w-full pl-10 pr-4 py-3 rounded-lg input-field"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1 error-text">
                <FaExclamationCircle className="text-xs" />
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold login-button"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          ¿No tienes una cuenta? {" "}
          <Link to="/register" className="register-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;