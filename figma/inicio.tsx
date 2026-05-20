import { useState } from "react";
import {
  Search,
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4="
          alt="Error"
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const categories = [
    {
      id: 1,
      name: "Plomería",
      icon: Wrench,
      image:
        "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=1200&q=80",
      count: "120+ profesionales",
    },
    {
      id: 2,
      name: "Electricidad",
      icon: Zap,
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
      count: "95+ profesionales",
    },
    {
      id: 3,
      name: "Carpintería",
      icon: Hammer,
      image:
        "https://images.unsplash.com/photo-1659930087003-2d64e33181f7?auto=format&fit=crop&w=1200&q=80",
      count: "80+ profesionales",
    },
    {
      id: 4,
      name: "Pintura",
      icon: PaintBucket,
      image:
        "https://images.unsplash.com/photo-1618832515490-e181c4794a45?auto=format&fit=crop&w=1200&q=80",
      count: "110+ profesionales",
    },
  ];

  const professionals = [
    {
      id: 1,
      name: "Carlos Méndez",
      specialty: "Plomero certificado",
      rating: 4.9,
      reviews: 127,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      distance: "1.2 km",
      price: "Desde $35.000",
      available: "Disponible hoy",
    },
    {
      id: 2,
      name: "Ana Rodríguez",
      specialty: "Electricista profesional",
      rating: 5.0,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
      distance: "2.5 km",
      price: "Desde $40.000",
      available: "Disponible mañana",
    },
    {
      id: 3,
      name: "Miguel Torres",
      specialty: "Carpintero experto",
      rating: 4.8,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      distance: "3.0 km",
      price: "Desde $38.000",
      available: "Disponible hoy",
    },
  ];

  const howItWorks = [
    {
      id: 1,
      icon: Search,
      title: "Busca el servicio",
      description:
        "Selecciona el tipo de trabajo que necesitas en tu hogar.",
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: "Compara profesionales",
      description:
        "Consulta perfiles verificados, reseñas y experiencia.",
    },
    {
      id: 3,
      icon: Clock,
      title: "Agenda fácilmente",
      description:
        "Habla con el profesional y coordina la visita rápidamente.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <Wrench className="text-white w-5 h-5" />
              </div>

              <div>
                <h1 className="font-bold text-lg leading-none">
                  Maestros a un clic
                </h1>
                <p className="text-xs text-gray-500">
                  Servicios confiables para tu hogar
                </p>
              </div>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-8">
              <a
                href="#servicios"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                Servicios
              </a>

              <a
                href="#profesionales"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                Profesionales
              </a>

              <a
                href="#como-funciona"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                Cómo funciona
              </a>

              <button className="text-blue-600 font-medium hover:text-blue-700 transition">
                Iniciar sesión
              </button>

              <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-xl font-medium shadow-md">
                Registrarse
              </button>
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* MOBILE MENU */}
          {mobileMenu && (
            <div className="lg:hidden pb-5 flex flex-col gap-4 border-t border-gray-100 pt-4">
              <a href="#" className="text-gray-700">
                Servicios
              </a>
              <a href="#" className="text-gray-700">
                Profesionales
              </a>
              <a href="#" className="text-gray-700">
                Cómo funciona
              </a>

              <button className="text-blue-600 font-medium text-left">
                Iniciar sesión
              </button>

              <button className="bg-blue-600 text-white py-3 rounded-xl">
                Registrarse
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-100" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                Profesionales verificados
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Encuentra expertos para tu hogar en minutos
              </h1>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Conecta con plomeros, electricistas, carpinteros y más
                profesionales confiables cerca de ti.
              </p>

              {/* SEARCH BOX */}
              <div className="mt-10 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 h-14">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />

                    <input
                      type="text"
                      placeholder="¿Qué servicio necesitas?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent outline-none w-full text-sm"
                    />
                  </div>

                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 h-14">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />

                    <input
                      type="text"
                      placeholder="Tu ubicación"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-transparent outline-none w-full text-sm"
                    />
                  </div>

                  <button className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2">
                    Buscar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* FEATURES */}
              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Pago seguro
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Reseñas reales
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Atención rápida
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80"
                  alt="Profesional trabajando"
                  className="w-full h-[500px] object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 w-64 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <Star className="w-6 h-6 text-emerald-500 fill-current" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">4.9/5</h3>
                    <p className="text-sm text-gray-500">
                      Más de 2.000 reseñas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        id="servicios"
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-blue-600 font-semibold mb-2">
                Servicios populares
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Todo lo que necesitas para tu hogar
              </h2>
            </div>

            <p className="text-gray-600 max-w-lg">
              Encuentra profesionales confiables para reparaciones,
              remodelaciones y mantenimiento.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;

              return (
                <div
                  key={category.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute bottom-5 left-5 text-white">
                      <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <h3 className="text-2xl font-bold">
                        {category.name}
                      </h3>

                      <p className="text-sm text-white/80">
                        {category.count}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROFESSIONALS */}
      <section
        id="profesionales"
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold mb-3">
              Profesionales destacados
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Expertos cerca de ti
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Contrata profesionales verificados con experiencia y excelentes
              valoraciones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={professional.image}
                    alt={professional.name}
                    className="w-full h-72 object-cover"
                  />

                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow">
                    {professional.available}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {professional.name}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {professional.specialty}
                      </p>
                    </div>

                    <div className="flex items-center bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      {professional.rating}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {professional.distance}
                    </div>

                    <span>{professional.reviews} reseñas</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Precio inicial
                      </p>

                      <p className="text-xl font-bold text-blue-600">
                        {professional.price}
                      </p>
                    </div>

                    <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl font-medium">
                      Ver perfil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition px-8 py-4 rounded-2xl font-semibold">
              Ver todos los profesionales
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="como-funciona"
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-3">
              Proceso sencillo
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Cómo funciona?
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Solicita servicios para tu hogar en pocos minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => {
              const IconComponent = step.icon;

              return (
                <div
                  key={step.id}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {step.id}
                    </span>

                    <h3 className="text-xl font-bold">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            ¿Eres maestro o profesional independiente?
          </h2>

          <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
            Regístrate en Maestros a un clic y conecta con cientos de clientes
            que buscan tus servicios todos los días.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 hover:bg-gray-100 transition px-8 py-4 rounded-2xl font-semibold shadow-lg">
              Registrarme como profesional
            </button>

            <button className="border-2 border-white text-white hover:bg-white/10 transition px-8 py-4 rounded-2xl font-semibold">
              Conocer más
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg">
                    Maestros a un clic
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed">
                Plataforma moderna para conectar clientes con profesionales
                confiables del hogar.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-5">
                Servicios
              </h3>

              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Plomería
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Electricidad
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Carpintería
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Pintura
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-5">
                Empresa
              </h3>

              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sobre nosotros
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Soporte
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-5">
                Seguridad
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />

                  <p>
                    Profesionales validados y con reseñas verificadas.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />

                  <p>
                    Protección y soporte durante todo el proceso.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-14 pt-8 text-sm text-center">
            © 2026 Maestros a un clic. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}