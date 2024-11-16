import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaExclamationCircle } from 'react-icons/fa';
import './RegisterPage.css';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const { signup, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    const success = await signup(values);
    if (success) {
      console.log("Registro exitoso");
      navigate("/tasks");
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen login-background">
      <div className="w-full max-w-md p-8 m-4 rounded-xl login-card">
        {authErrors && authErrors.length > 0 && authErrors.map((error, index) => (
          <div key={index} className="flex items-center gap-2 p-3 mb-4 rounded-lg error-message">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        ))}
        
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Crear Nueva Cuenta
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
              Usuario
            </label>
            <div className="relative">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                {...register("username", { required: "El nombre de usuario es obligatorio" })}
                className="w-full pl-10 pr-4 py-3 rounded-lg input-field"
                placeholder="Tu nombre de usuario"
              />
            </div>
            {formErrors.username && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1 error-text">
                <FaExclamationCircle className="text-xs" />
                {formErrors.username.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Correo
            </label>
            <div className="relative">
              <span className="input-icon">
                <FaEnvelope />
              </span>
              <input
                type="email"
                {...register("email", { required: "El email es obligatorio" })}
                className="w-full pl-10 pr-4 py-3 rounded-lg input-field"
                placeholder="Tu correo electrónico"
              />
            </div>
            {formErrors.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1 error-text">
                <FaExclamationCircle className="text-xs" />
                {formErrors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type="password"
                {...register("password", { 
                  required: "La contraseña es obligatoria"
                  // minLength: {
                  //   value: 6,
                  //   message: "La contraseña debe tener al menos 6 caracteres"
                  // }
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg input-field"
                placeholder="Tu contraseña"
              />
            </div>
            {formErrors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1 error-text">
                <FaExclamationCircle className="text-xs" />
                {formErrors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-200 mb-2">
              Rol
            </label>
            <div className="relative">
              <span className="input-icon">
                <FaUserTag />
              </span>
              <select
                {...register("rol", { required: "El rol es obligatorio" })}
                className="w-full pl-10 pr-4 py-3 rounded-lg input-field"
              >
                <option value="">Seleccionar rol</option>           
                <option value="administrador">administrador</option>
                <option value="investigador">Investigador</option>
                <option value="colaborador">Colaborador</option>
              </select>
            </div>
            {formErrors.rol && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1 error-text">
                <FaExclamationCircle className="text-xs" />
                {formErrors.rol.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold login-button"
          >
            Crear Cuenta
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          ¿Ya tienes una cuenta? {" "}
          <Link to="/login" className="register-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;