import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock3,
  Heart,
  Bell,
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Filter,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  Menu,
  X,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export default function ClientDashboard() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const categories = [
    {
      id: 1,
      name: "Plomería",
      icon: Wrench,
      jobs: "120+ profesionales",
    },
    {
      id: 2,
      name: "Electricidad",
      icon: Zap,
      jobs: "95+ profesionales",
    },
    {
      id: 3,
      name: "Carpintería",
      icon: Hammer,
      jobs: "80+ profesionales",
    },
    {
      id: 4,
      name: "Pintura",
      icon: PaintBucket,
      jobs: "110+ profesionales",
    },
  ];

  const professionals = [
    {
      id: 1,
      name: "Carlos Méndez",
      specialty: "Plomero certificado",
      rating: 4.9,
      reviews: 127,
      distance: "1.2 km",
      price: "$45.000/h",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      online: true,
    },
    {
      id: 2,
      name: "Ana Rodríguez",
      specialty: "Electricista profesional",
      rating: 5.0,
      reviews: 89,
      distance: "2.5 km",
      price: "$55.000/h",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
      online: true,
    },
    {
      id: 3,
      name: "Miguel Torres",
      specialty: "Carpintero experto",
      rating: 4.8,
      reviews: 156,
      distance: "3 km",
      price: "$50.000/h",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      online: false,
    },
  ];

  const activeBookings = [
    {
      id: 1,
      professional: "Carlos Méndez",
      service: "Reparación de tubería",
      date: "Hoy · 3:00 PM",
      status: "En camino",
    },
    {
      id: 2,
      professional: "Ana Rodríguez",
      service: "Instalación eléctrica",
      date: "Mañana · 10:00 AM",
      status: "Confirmado",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="font-black text-xl text-gray-900">
                  Maestros a un clic
                </h1>

                <p className="text-xs text-gray-500">
                  Dashboard cliente
                </p>
              </div>
            </div>

            {/* DESKTOP SEARCH */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-10">
              <div className="w-full relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="¿Qué servicio necesitas hoy?"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full h-14 rounded-2xl bg-[#F4F7FB] border border-gray-200 pl-14 pr-5 outline-none focus:border-[#2563EB] transition"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              <button className="hidden md:flex w-12 h-12 rounded-2xl bg-[#F4F7FB] items-center justify-center hover:bg-gray-200 transition relative">
                <Bell className="w-5 h-5 text-gray-700" />

                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500" />
              </button>

              <button className="hidden md:flex w-12 h-12 rounded-2xl bg-[#F4F7FB] items-center justify-center hover:bg-gray-200 transition">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>

              <div className="hidden md:flex items-center gap-3 bg-[#F4F7FB] rounded-2xl pl-3 pr-5 py-2 border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                  className="w-10 h-10 rounded-xl object-cover"
                />

                <div>
                  <h3 className="font-semibold text-sm">
                    Juan
                  </h3>

                  <p className="text-xs text-gray-500">
                    Cliente premium
                  </p>
                </div>
              </div>

              {/* MOBILE */}
              <button
                onClick={() =>
                  setMobileMenu(!mobileMenu)
                }
                className="lg:hidden w-12 h-12 rounded-2xl bg-[#F4F7FB] flex items-center justify-center"
              >
                {mobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="pb-4 lg:hidden">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Buscar servicio..."
                className="w-full h-14 rounded-2xl bg-[#F4F7FB] border border-gray-200 pl-14 pr-5 outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] p-8 lg:p-12 text-white mb-8">
          {/* GLOW */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Profesionales verificados cerca de ti
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-5">
              Encuentra el profesional ideal en minutos
            </h2>

            <p className="text-blue-100 text-lg md:text-xl mb-8 leading-relaxed">
              Reserva servicios para tu hogar de forma
              rápida, segura y confiable.
            </p>

            {/* QUICK FILTERS */}
            <div className="flex flex-wrap gap-3">
              {[
                "Urgente",
                "Más cercanos",
                "Mejor calificados",
                "Disponibles hoy",
              ].map((item) => (
                <button
                  key={item}
                  className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_420px] gap-8">
          {/* LEFT */}
          <div className="space-y-8">
            {/* CATEGORIES */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">
                    Categorías
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Explora servicios populares
                  </p>
                </div>

                <button className="flex items-center gap-2 text-[#2563EB] font-semibold">
                  Ver todas
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <div
                      key={category.id}
                      className="group bg-white rounded-[2rem] border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition">
                        <Icon className="w-8 h-8" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {category.jobs}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* FILTERS */}
            <section className="bg-white rounded-[2rem] border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Filtros rápidos
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Personaliza tu búsqueda
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    "Disponible ahora",
                    "Menos de $50k",
                    "4.8+ estrellas",
                    "Más cercano",
                  ].map((filter) => (
                    <button
                      key={filter}
                      className="px-5 py-3 rounded-2xl bg-[#F4F7FB] hover:bg-[#2563EB] hover:text-white transition text-sm font-semibold"
                    >
                      {filter}
                    </button>
                  ))}

                  <button className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>

            {/* PROFESSIONALS */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">
                    Profesionales cerca de ti
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Recomendados según tu ubicación
                  </p>
                </div>

                <button className="flex items-center gap-2 text-[#2563EB] font-semibold">
                  Ver más
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                {professionals.map((pro) => (
                  <div
                    key={pro.id}
                    className="bg-white rounded-[2rem] border border-gray-100 p-5 hover:shadow-2xl transition"
                  >
                    <div className="flex flex-col lg:flex-row gap-5">
                      {/* IMAGE */}
                      <div className="relative">
                        <img
                          src={pro.image}
                          className="w-full lg:w-[180px] h-[180px] rounded-[1.5rem] object-cover"
                        />

                        {pro.online && (
                          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                            Disponible
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-2xl font-black text-gray-900">
                                {pro.name}
                              </h3>

                              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                            </div>

                            <p className="text-gray-600 mb-4">
                              {pro.specialty}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />

                                <span>
                                  {pro.rating} (
                                  {pro.reviews} reseñas)
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />

                                <span>
                                  {pro.distance}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Clock3 className="w-4 h-4" />

                                <span>
                                  Responde en 10 min
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* PRICE */}
                          <div className="flex flex-col items-start lg:items-end">
                            <span className="text-3xl font-black text-[#2563EB]">
                              {pro.price}
                            </span>

                            <span className="text-sm text-gray-500">
                              Tarifa promedio
                            </span>
                          </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-wrap gap-3 mt-6">
                          <button className="flex-1 min-w-[180px] h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-bold">
                            Reservar servicio
                          </button>

                          <button className="h-14 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition font-semibold">
                            Ver perfil
                          </button>

                          <button className="w-14 h-14 rounded-2xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition flex items-center justify-center">
                            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            {/* MAP */}
            <section className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Mapa en tiempo real
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Profesionales cerca de ti
                  </p>
                </div>

                <button className="w-12 h-12 rounded-2xl bg-[#F4F7FB] flex items-center justify-center">
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
                  className="w-full h-full object-cover"
                />

                {/* MARKERS */}
                <div className="absolute top-20 left-24">
                  <div className="w-5 h-5 rounded-full bg-[#2563EB] border-4 border-white shadow-xl" />
                </div>

                <div className="absolute bottom-28 right-20">
                  <div className="w-5 h-5 rounded-full bg-green-500 border-4 border-white shadow-xl" />
                </div>

                <div className="absolute top-1/2 right-1/3">
                  <div className="w-5 h-5 rounded-full bg-red-500 border-4 border-white shadow-xl" />
                </div>
              </div>
            </section>

            {/* BOOKINGS */}
            <section className="bg-white rounded-[2rem] border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Reservas activas
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Servicios programados
                  </p>
                </div>

                <CalendarDays className="w-6 h-6 text-[#2563EB]" />
              </div>

              <div className="space-y-5">
                {activeBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-[1.5rem] bg-[#F4F7FB] p-5 border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {booking.service}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {booking.professional}
                        </p>
                      </div>

                      <div className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-semibold">
                        {booking.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock3 className="w-4 h-4" />

                      {booking.date}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 transition text-white font-bold mt-6">
                Ver todas las reservas
              </button>
            </section>

            {/* FAVORITES */}
            <section className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-[2rem] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                  <Heart className="w-8 h-8" />
                </div>

                <h2 className="text-3xl font-black mb-3">
                  Tus favoritos
                </h2>

                <p className="text-blue-100 mb-6 leading-relaxed">
                  Guarda profesionales frecuentes y
                  reserva más rápido.
                </p>

                <button className="w-full h-14 rounded-2xl bg-white text-[#2563EB] font-bold hover:bg-gray-100 transition">
                  Ver favoritos
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}