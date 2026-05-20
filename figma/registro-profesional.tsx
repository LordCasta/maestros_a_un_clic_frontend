import { useState } from "react";
import {
  Wrench,
  Upload,
  Camera,
  Star,
  ShieldCheck,
  Briefcase,
  Clock3,
  MapPin,
  CheckCircle2,
  Eye,
  ArrowRight,
  ArrowLeft,
  FileBadge,
  ImagePlus,
  Sparkles,
  BadgeCheck,
  DollarSign,
} from "lucide-react";

export default function ProfessionalRegisterPage() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    specialty: "",
    hourlyRate: "",
    commune: "",
    experience: "",
    description: "",
    profilePhoto: null,
    certificates: [],
    portfolio: [],
  });

  const [errors, setErrors] = useState({});

  const specialties = [
    "Plomería",
    "Electricidad",
    "Carpintería",
    "Pintura",
    "Aires acondicionados",
    "Cerrajería",
    "Construcción",
    "Drywall",
  ];

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

  const handleFileUpload = (field, files) => {
    setForm({
      ...form,
      [field]: files,
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

    if (!form.fullName)
      newErrors.fullName = "Ingresa tu nombre";

    if (!form.specialty)
      newErrors.specialty =
        "Selecciona una especialidad";

    if (!form.hourlyRate)
      newErrors.hourlyRate =
        "Ingresa tu tarifa";

    if (!form.commune)
      newErrors.commune = "Ingresa tu comuna";

    if (!form.profilePhoto)
      newErrors.profilePhoto =
        "Sube una foto de perfil";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!form.experience)
      newErrors.experience =
        "Ingresa tus años de experiencia";

    if (!form.description)
      newErrors.description =
        "Describe tus servicios";

    if (form.description.length < 50)
      newErrors.description =
        "La descripción debe tener mínimo 50 caracteres";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }

    if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Registro profesional:", form);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex overflow-hidden">
      {/* LEFT SIDE */}
      <div className="hidden xl:flex w-[48%] relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB]">
        {/* GLOW EFFECTS */}
        <div className="absolute top-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute bottom-[-180px] left-[-180px] w-[420px] h-[420px] rounded-full bg-cyan-400/20 blur-3xl" />

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-20 text-white">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-sm mb-10 w-fit">
            <Sparkles className="w-4 h-4" />
            Plataforma premium para profesionales
          </div>

          {/* TITLE */}
          <h1 className="text-6xl leading-tight font-black mb-8">
            Convierte tu oficio en un negocio digital
          </h1>

          <p className="text-blue-100 text-xl leading-relaxed mb-12 max-w-xl">
            Miles de clientes buscan profesionales
            verificados todos los días en Maestros a un
            clic.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-5 mb-14">
            <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
              <h3 className="text-3xl font-black">
                +12K
              </h3>

              <p className="text-sm text-blue-100 mt-1">
                Clientes activos
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
              <h3 className="text-3xl font-black">
                +4.9
              </h3>

              <p className="text-sm text-blue-100 mt-1">
                Calificación promedio
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
              <h3 className="text-3xl font-black">
                +2M
              </h3>

              <p className="text-sm text-blue-100 mt-1">
                Servicios realizados
              </p>
            </div>
          </div>

          {/* BENEFITS */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <BadgeCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Perfil profesional verificado
                </h3>

                <p className="text-blue-100">
                  Gana confianza y consigue más
                  contrataciones.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <DollarSign className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Define tus tarifas
                </h3>

                <p className="text-blue-100">
                  Tú controlas tus precios y horarios.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Más visibilidad online
                </h3>

                <p className="text-blue-100">
                  Destaca frente a miles de clientes
                  potenciales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex justify-center items-center px-5 py-10 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* LOGO */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#2563EB] shadow-xl flex items-center justify-center">
              <Wrench className="w-7 h-7 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Maestros a un clic
              </h2>

              <p className="text-gray-500">
                Registro profesional
              </p>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-8 py-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-black">
                    Crea tu perfil profesional
                  </h3>

                  <p className="text-blue-100 mt-2">
                    Completa tu información y comienza
                    a recibir clientes.
                  </p>
                </div>

                <div className="hidden sm:flex w-20 h-20 rounded-3xl bg-white/10 items-center justify-center">
                  <Briefcase className="w-10 h-10" />
                </div>
              </div>

              {/* STEPPER */}
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      step >= item
                        ? "bg-white"
                        : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* BODY */}
            <div className="p-6 sm:p-8">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      Información principal
                    </h4>

                    <p className="text-gray-500">
                      Construye una primera impresión
                      profesional.
                    </p>
                  </div>

                  {/* PROFILE PHOTO */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Foto de perfil
                    </label>

                    <label className="relative border-2 border-dashed border-gray-300 hover:border-[#2563EB] transition rounded-[2rem] p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-3xl bg-[#2563EB] text-white flex items-center justify-center shadow-xl mb-5">
                          <Camera className="w-10 h-10" />
                        </div>

                        <h3 className="font-bold text-lg text-gray-800">
                          Sube tu foto profesional
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          Una buena foto genera más
                          confianza
                        </p>

                        <div className="mt-5 px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold">
                          Seleccionar imagen
                        </div>
                      </div>

                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleChange(
                            "profilePhoto",
                            e.target.files[0]
                          )
                        }
                      />
                    </label>

                    {form.profilePhoto && (
                      <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {form.profilePhoto.name}
                      </div>
                    )}
                  </div>

                  {/* INPUTS */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* NAME */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre completo
                      </label>

                      <input
                        type="text"
                        placeholder="Juan Castaño"
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange(
                            "fullName",
                            e.target.value
                          )
                        }
                        className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* SPECIALTY */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Especialidad
                      </label>

                      <select
                        value={form.specialty}
                        onChange={(e) =>
                          handleChange(
                            "specialty",
                            e.target.value
                          )
                        }
                        className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-[#2563EB]"
                      >
                        <option value="">
                          Selecciona
                        </option>

                        {specialties.map((item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* RATE */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tarifa por hora
                      </label>

                      <input
                        type="number"
                        placeholder="$50.000"
                        value={form.hourlyRate}
                        onChange={(e) =>
                          handleChange(
                            "hourlyRate",
                            e.target.value
                          )
                        }
                        className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* COMMUNE */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Comuna / zona
                      </label>

                      <input
                        type="text"
                        placeholder="Comuna 14"
                        value={form.commune}
                        onChange={(e) =>
                          handleChange(
                            "commune",
                            e.target.value
                          )
                        }
                        className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  {/* NEXT */}
                  <button
                    onClick={nextStep}
                    className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-bold flex items-center justify-center gap-2 shadow-xl"
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      Experiencia profesional
                    </h4>

                    <p className="text-gray-500">
                      Cuéntale a los clientes por qué
                      deberían contratarte.
                    </p>
                  </div>

                  {/* EXPERIENCE */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Años de experiencia
                    </label>

                    <div className="relative">
                      <Clock3 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                      <input
                        type="number"
                        placeholder="5"
                        value={form.experience}
                        onChange={(e) =>
                          handleChange(
                            "experience",
                            e.target.value
                          )
                        }
                        className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 pl-14 pr-5 outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción profesional
                    </label>

                    <textarea
                      rows={6}
                      placeholder="Describe tu experiencia, servicios, herramientas y fortalezas..."
                      value={form.description}
                      onChange={(e) =>
                        handleChange(
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 p-5 outline-none focus:border-[#2563EB] resize-none"
                    />

                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-400">
                        Mínimo 50 caracteres
                      </span>

                      <span className="text-gray-500">
                        {
                          form.description.length
                        }{" "}
                        / 300
                      </span>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 h-14 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Volver
                    </button>

                    <button
                      onClick={nextStep}
                      className="flex-1 h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-bold flex items-center justify-center gap-2 shadow-xl"
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      Certificados y portafolio
                    </h4>

                    <p className="text-gray-500">
                      Muestra evidencia de tu trabajo y
                      aumenta tu credibilidad.
                    </p>
                  </div>

                  {/* CERTIFICATES */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Certificados
                    </label>

                    <label className="border-2 border-dashed border-gray-300 hover:border-[#2563EB] transition rounded-[2rem] bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer">
                      <FileBadge className="w-12 h-12 text-[#2563EB] mb-4" />

                      <h3 className="font-bold text-lg text-gray-800">
                        Sube certificados
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        PDF, JPG, PNG
                      </p>

                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            "certificates",
                            Array.from(
                              e.target.files
                            )
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* PORTFOLIO */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Portafolio de trabajos
                    </label>

                    <label className="border-2 border-dashed border-gray-300 hover:border-[#2563EB] transition rounded-[2rem] bg-gray-50 p-8 flex flex-col items-center justify-center cursor-pointer">
                      <ImagePlus className="w-12 h-12 text-[#2563EB] mb-4" />

                      <h3 className="font-bold text-lg text-gray-800">
                        Agrega fotos de trabajos
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Los perfiles con portafolio
                        reciben más solicitudes
                      </p>

                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            "portfolio",
                            Array.from(
                              e.target.files
                            )
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* PREVIEW CARD */}
                  <div className="rounded-[2rem] border border-gray-200 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center">
                          <Eye className="w-9 h-9" />
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold">
                            Vista previa
                          </h3>

                          <p className="text-blue-100">
                            Así verán los clientes tu
                            perfil
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />

                        <span className="font-semibold">
                          Perfil destacado
                        </span>
                      </div>

                      <p className="text-blue-100">
                        Los perfiles completos generan
                        hasta 4 veces más solicitudes.
                      </p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 h-14 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      Volver
                    </button>

                    <button
                      type="submit"
                      className="flex-1 h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-bold shadow-xl flex items-center justify-center gap-2"
                    >
                      Completar registro
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}