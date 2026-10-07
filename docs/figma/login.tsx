import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Briefcase,
  Wrench,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    if (!email) {
      newErrors.email = "Ingresa tu correo electrónico";
    } else if (!validateEmail(email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!password) {
      newErrors.password = "Ingresa tu contraseña";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      console.log("Login exitoso");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Maestros a un clic
              </h1>

              <p className="text-sm text-gray-500">
                Marketplace de servicios para el hogar
              </p>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-6 sm:p-8">
            {/* HEADER */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] px-4 py-2 rounded-full text-sm font-medium mb-5">
                <ShieldCheck className="w-4 h-4" />
                Acceso seguro
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Bienvenido de nuevo
              </h2>

              <p className="text-gray-500 leading-relaxed">
                Inicia sesión para gestionar tus servicios, reservas y
                profesionales.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>

                <div
                  className={`flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-[#2563EB]"
                  }`}
                >
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />

                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (errors.email) {
                        setErrors({
                          ...errors,
                          email: "",
                        });
                      }
                    }}
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>

                  <a
                    href="#"
                    className="text-sm text-[#2563EB] hover:text-blue-700 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <div
                  className={`flex items-center h-14 rounded-2xl border bg-gray-50 px-4 transition-all ${
                    errors.password
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-[#2563EB]"
                  }`}
                >
                  <Lock className="w-5 h-5 text-gray-400 mr-3" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (errors.password) {
                        setErrors({
                          ...errors,
                          password: "",
                        });
                      }
                    }}
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />

                  Recordarme
                </label>

                <span className="text-gray-400">
                  Acceso rápido y seguro
                </span>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full h-14 bg-[#2563EB] hover:bg-blue-700 transition-all duration-300 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Iniciar sesión
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative my-8">
              <div className="border-t border-gray-200"></div>

              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-400">
                  o continuar como
                </span>
              </div>
            </div>

            {/* REGISTER BUTTONS */}
            <div className="space-y-4">
              <button className="w-full h-14 border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition-all rounded-2xl flex items-center justify-center gap-3 text-gray-700 font-medium">
                <User className="w-5 h-5 text-[#2563EB]" />
                Cliente
              </button>

              <button className="w-full h-14 border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50 transition-all rounded-2xl flex items-center justify-center gap-3 text-gray-700 font-medium">
                <Briefcase className="w-5 h-5 text-[#2563EB]" />
                Profesional
              </button>
            </div>

            {/* FOOTER */}
            <p className="text-center text-sm text-gray-500 mt-8 leading-relaxed">
              Al continuar aceptas nuestros{" "}
              <a
                href="#"
                className="text-[#2563EB] hover:text-blue-700 font-medium"
              >
                Términos y Condiciones
              </a>{" "}
              y{" "}
              <a
                href="#"
                className="text-[#2563EB] hover:text-blue-700 font-medium"
              >
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] overflow-hidden">
        {/* BG EFFECT */}
        <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full bg-white/10" />

        <div className="absolute bottom-[-140px] left-[-140px] w-[420px] h-[420px] rounded-full bg-white/10" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm mb-8">
              <ShieldCheck className="w-4 h-4" />
              Plataforma confiable
            </div>

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Conecta con profesionales verificados
            </h2>

            <p className="text-blue-100 text-lg leading-relaxed mb-10">
              Encuentra plomeros, electricistas, carpinteros y expertos del
              hogar cerca de ti de forma rápida y segura.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-5">
              <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5">
                <h3 className="text-3xl font-bold mb-1">+2K</h3>

                <p className="text-sm text-blue-100">
                  Profesionales activos
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5">
                <h3 className="text-3xl font-bold mb-1">4.9</h3>

                <p className="text-sm text-blue-100">
                  Calificación promedio
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5">
                <h3 className="text-3xl font-bold mb-1">24/7</h3>

                <p className="text-sm text-blue-100">
                  Atención disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}