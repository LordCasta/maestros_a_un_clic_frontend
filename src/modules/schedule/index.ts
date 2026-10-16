/**
 * Módulo "Agenda y disponibilidad" (HU003, HU025, HU030).
 * - HU003: el profesional gestiona su horario, descanso y bloqueos (vista Disponibilidad).
 * - HU025: horas libres de un profesional (`SlotPicker`, `useProfessionalSlots`), que se
 *   refrescan solas cuando cambia su agenda.
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export { default as SlotPicker } from './components/SlotPicker.vue'
export { scheduleKeys, useProfessionalSlots } from './queries'
export { scheduleRoutes } from './routes'
