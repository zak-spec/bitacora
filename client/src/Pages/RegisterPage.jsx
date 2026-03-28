import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, isAuthenticated, error: Registererror } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    await signup(values);
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-zinc-800 max-w-md p-10 rounded-md shadow-md">
        {Registererror && Registererror.length > 0 && Registererror.map((error, index) => (
          <div key={index} className="bg-red-500 text-white text-center p-2 mb-2 rounded-md">
            {error}
          </div>
        ))}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: "El nombre de usuario es obligatorio" })}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email:
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "El email es obligatorio" })}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "La contraseña es obligatoria" })}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="rol" className="block text-sm font-medium text-white">
              Rol:
            </label>
            <select
              id="rol"
              {...register("rol", { required: "El rol es obligatorio" })}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">seleccionar</option>
              <option value="investigador">Investigador</option>
              <option value="colaborador">Colaborador</option>
            </select>
            {errors.rol && (
              <p className="text-red-500 text-sm mt-1">{errors.rol.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;