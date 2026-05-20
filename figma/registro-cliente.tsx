import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Wrench,
  ShieldCheck,
  Upload,
  CheckCircle2,
  MapPin,
  FileText,
  Camera,
} from "lucide-react";

export default function RegisterClientPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    selfie: null,
    document: null,
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!form.name) {
      newErrors.name = "Ingresa tu nombre";
    }

    if (!form.email) {
      newErrors.email = "Ingresa tu correo";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!form.password) {
      newErrors.password = "Ingresa una contraseña";
    } else if (form.password.length < 6) {
      newErrors.password =
        "La contraseña debe tener mínimo 6 caracteres";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword =
        "Confirma tu contraseña";
    } else if (
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!form.location) {
      newErrors.location = "Ingresa tu ubicación";
    }

    if (!form.selfie) {
      newErrors.selfie = "Sube una selfie";
    }

    if (!form.document) {
      newErrors.document =
        "Sube una foto del documento";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateStep2()) {
      console.log("Registro completado", form);
    }
  };

  const handleFileUpload = (field, file) => {
    setForm({
      ...form,
      [field]: file,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] overflow-hidden">
        {/* DECORATIONS */}
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-white/10 rounded-full" />

        <div className="absolute bottom-[-150px] left-[-150px] w-[450px] h-[450px] bg-white/10 rounded-full" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm mb-8">
              <ShieldCheck className="w-4 h-4" />
              Registro seguro
            </div>

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Encuentra profesionales confiables cerca de ti
            </h2>

            <p className="text-blue-100 text-lg leading-relaxed mb-10">
              Publica solicitudes, agenda servicios y
              conecta con expertos verificados para tu
              hogar.
            </p>

            {/* FEATURES */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Seguridad verificada
                  </h3>

                  <p className="text-blue-100 text-sm">
                    Validamos usuarios para generar
                    confianza.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Servicios locales
                  </h3>

                  <p className="text-blue-100 text-sm">
                    Encuentra maestros disponibles en tu
                    zona.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Maestros a un clic
              </h1>

              <p className="text-sm text-gray-500">
                Registro de cliente
              </p>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-6 sm:p-8">
            {/* PROGRESS */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= 1
                        ? "bg-[#2563EB] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    1
                  </div>

                  <p className="text-xs mt-2 text-gray-500">
                    Cuenta
                  </p>
                </div>

                <div
                  className={`h-1 flex-1 rounded-full mx-2 ${
                    step >= 2
                      ? "bg-[#2563EB]"
                      : "bg-gray-200"
                  }`}
                />

                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= 2
                        ? "bg-[#2563EB] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>

                  <p className="text-xs mt-2 text-gray-500">
                    Verificación
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Crear cuenta
                  </h2>

                  <p className="text-gray-500">
                    Completa tu información básica.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* NAME */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>

                    <div className="flex items-center h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4">
                      <User className="w-5 h-5 text-gray-400 mr-3" />

                      <input
                        type="text"
                        placeholder="Juan Castaño"
                        value={form.name}
                        onChange={(e) =>
                          handleChange(
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-sm"
                      />
                    </div>

                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico
                    </label>

                    <div className="flex items-center h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />

                      <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={form.email}
                        onChange={(e) =>
                          handleChange(
                            "email",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-sm"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>

                    <div className="flex items-center h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4">
                      <Lock className="w-5 h-5 text-gray-400 mr-3" />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Mínimo 6 caracteres"
                        value={form.password}
                        onChange={(e) =>
                          handleChange(
                            "password",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-sm"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar contraseña
                    </label>

                    <div className="flex items-center h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4">
                      <Lock className="w-5 h-5 text-gray-400 mr-3" />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Confirma tu contraseña"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          handleChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-sm"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* NEXT BUTTON */}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full h-14 bg-[#2563EB] hover:bg-blue-700 transition rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Verificación de identidad
                  </h2>

                  <p className="text-gray-500">
                    Esto nos ayuda a mantener una
                    plataforma segura y confiable.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* LOCATION */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>

                    <div className="flex items-center h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />

                      <input
                        type="text"
                        placeholder="Medellín, Colombia"
                        value={form.location}
                        onChange={(e) =>
                          handleChange(
                            "location",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-sm"
                      />
                    </div>

                    {errors.location && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* SELFIE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Selfie
                    </label>

                    <label className="border-2 border-dashed border-gray-300 hover:border-[#2563EB] transition rounded-3xl bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer text-center">
                      <Camera className="w-10 h-10 text-[#2563EB] mb-4" />

                      <h3 className="font-semibold text-gray-800 mb-1">
                        Arrastra tu selfie aquí
                      </h3>

                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG hasta 10MB
                      </p>

                      <div className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-medium">
                        Seleccionar archivo
                      </div>

                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            "selfie",
                            e.target.files[0]
                          )
                        }
                      />
                    </label>

                    {form.selfie && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        {form.selfie.name}
                      </div>
                    )}

                    {errors.selfie && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.selfie}
                      </p>
                    )}
                  </div>

                  {/* DOCUMENT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Documento de identidad
                    </label>

                    <label className="border-2 border-dashed border-gray-300 hover:border-[#2563EB] transition rounded-3xl bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer text-center">
                      <FileText className="w-10 h-10 text-[#2563EB] mb-4" />

                      <h3 className="font-semibold text-gray-800 mb-1">
                        Sube tu documento
                      </h3>

                      <p className="text-sm text-gray-500 mb-4">
                        Cédula o documento oficial
                      </p>

                      <div className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-medium">
                        Seleccionar archivo
                      </div>

                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileUpload(
                            "document",
                            e.target.files[0]
                          )
                        }
                      />
                    </label>

                    {form.document && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        {form.document.name}
                      </div>
                    )}

                    {errors.document && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.document}
                      </p>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-14 border border-gray-200 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Volver
                    </button>

                    <button
                      type="submit"
                      className="flex-1 h-14 bg-[#2563EB] hover:bg-blue-700 transition rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
                    >
                      Completar registro
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* LOGIN */}
            <p className="text-center text-sm text-gray-500 mt-8">
              ¿Ya tienes cuenta?{" "}
              <a
                href="#"
                className="text-[#2563EB] font-semibold hover:text-blue-700"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}