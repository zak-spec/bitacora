import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaExclamationCircle } from 'react-icons/fa';
// import './RegisterPage.css';

const CreateUserPage = () => {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const { signup, isAuthenticated, user, errors: authErrors } = useAuth();
  const navigate = useNavigate();

  // Proteger la ruta
  useEffect(() => {
    console.log('Verificando autorización:', { isAuthenticated, userRole: user?.rol });
    if (!isAuthenticated || user?.rol !== 'administrador') {
      console.log('Usuario no autorizado, redirigiendo...');
      navigate('/users');
    }
  }, [isAuthenticated, user]);

  const onSubmit = handleSubmit(async (values) => {
    console.log('Intentando crear usuario con datos:', values);
    try {
      const result = await signup(values);
      console.log('Resultado del registro:', result);
      if (result.success) {
        // Dar tiempo para que se actualice la lista de usuarios
        setTimeout(() => {
          navigate('/users');
        }, 1000);
      }
    } catch (error) {
      console.error("Error en registro:", error);
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
          Crear Nuevo Usuario
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;