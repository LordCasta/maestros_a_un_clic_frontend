/**
 * Módulo "Agenda y disponibilidad" (HU003, HU025, HU030).
 * Hecho: horas libres de un profesional (HU025) con `useProfessionalSlots` y `SlotPicker`.
 * Maqueta: la vista de disponibilidad del profesional; se conecta a /professional/availability con HU003.
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export { default as SlotPicker } from './components/SlotPicker.vue'
export { scheduleKeys, useProfessionalSlots } from './queries'
export { scheduleRoutes } from './routes'
