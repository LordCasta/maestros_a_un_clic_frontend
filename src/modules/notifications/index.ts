/**
 * Módulo de notificaciones (HU018): campana con el contador de no leídas y la lista.
 * Las notificaciones las crea el backend (app/Notifications) en cada evento de una reserva o
 * del chat; aquí solo se muestran y se marcan como leídas.
 * API pública del módulo: lo que no se exporta aquí es interno.
 */
export { default as NotificationBell } from './components/NotificationBell.vue'
export { notificationKeys } from './queries'
