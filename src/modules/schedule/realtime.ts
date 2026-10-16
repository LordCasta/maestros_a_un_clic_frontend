import { useQueryCache } from '@pinia/colada'
import { onBeforeUnmount, toValue, watch, type MaybeRefOrGetter } from 'vue'

import { getRealtime } from '@/shared/realtime/echo'

import { scheduleKeys } from './queries'

const EVENT = '.availability.changed'

/**
 * HU003, HU025: si la agenda del profesional cambia mientras el cliente mira sus horas libres
 * (otro cliente reservó, el profesional bloqueó horas…), se vuelven a pedir.
 * Canal público `professional.{id}.availability` (backend/docs/tiempo-real.md).
 */
export function useAvailabilityUpdates(professionalId: MaybeRefOrGetter<number>) {
  const queryCache = useQueryCache()
  let channel: string | null = null

  function onChange() {
    void queryCache.invalidateQueries({
      key: scheduleKeys.professionalSlots(toValue(professionalId)),
    })
  }

  function stop() {
    if (channel) getRealtime()?.channel(channel).stopListening(EVENT, onChange)
    channel = null
  }

  watch(
    () => toValue(professionalId),
    (id) => {
      stop()
      const echo = getRealtime()
      if (!echo || !id) return
      channel = `professional.${id}.availability`
      echo.channel(channel).listen(EVENT, onChange)
    },
    { immediate: true },
  )

  onBeforeUnmount(stop)
}
