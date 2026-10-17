import { onBeforeUnmount, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

import { getRealtime } from './echo'

/**
 * Canal de presencia compartido. Varios componentes de una misma vista pueden usar el mismo
 * canal (p. ej. `booking.{id}`: estado de la reserva y chat). Hay una sola suscripción por
 * canal y se abandona cuando el último componente que la usa se desmonta.
 *
 *   const { members, listen } = usePresenceChannel(() => `booking.${id}`)
 *   listen('.message.sent', (message) => { … })
 *   const online = computed(() => members.value.some((m) => m.id === otherId))
 */

/** Lo que devuelve el backend al autorizar la entrada (p. ej. BookingChannel::join). */
export interface PresenceMember {
  id: number
  name: string
  avatar_url: string | null
}

type Channel = ReturnType<NonNullable<ReturnType<typeof getRealtime>>['join']>

interface Entry {
  channel: Channel
  members: Ref<PresenceMember[]>
  users: number
}

const entries = new Map<string, Entry>()

function join(name: string): Entry | null {
  const existing = entries.get(name)
  if (existing) {
    existing.users++
    return existing
  }

  const echo = getRealtime()
  if (!echo) return null

  const members = ref<PresenceMember[]>([])
  const channel = echo
    .join(name)
    .here((users: PresenceMember[]) => (members.value = users))
    .joining((user: PresenceMember) => {
      members.value = [...members.value.filter((member) => member.id !== user.id), user]
    })
    .leaving((user: PresenceMember) => {
      members.value = members.value.filter((member) => member.id !== user.id)
    })

  const entry = { channel, members, users: 1 }
  entries.set(name, entry)
  return entry
}

function leave(name: string) {
  const entry = entries.get(name)
  if (!entry) return
  entry.users--
  if (entry.users <= 0) {
    entries.delete(name)
    getRealtime()?.leave(name)
  }
}

export function usePresenceChannel(name: MaybeRefOrGetter<string | null>) {
  const members = ref<PresenceMember[]>([])
  const listeners: [string, (payload: never) => void][] = []
  let current: string | null = null
  let stopMembers: (() => void) | null = null

  function attach(entry: Entry) {
    for (const [event, callback] of listeners) entry.channel.listen(event, callback)
    stopMembers = watch(entry.members, (value) => (members.value = value), { immediate: true })
  }

  function detach() {
    if (!current) return
    const entry = entries.get(current)
    for (const [event, callback] of listeners) entry?.channel.stopListening(event, callback)
    stopMembers?.()
    stopMembers = null
    members.value = []
    leave(current)
    current = null
  }

  watch(
    () => toValue(name),
    (next) => {
      detach()
      if (!next) return
      const entry = join(next)
      if (!entry) return
      current = next
      attach(entry)
    },
    { immediate: true },
  )

  onBeforeUnmount(detach)

  /** Escucha un evento (`.recurso.accion`) mientras el componente esté montado. */
  function listen<T>(event: string, callback: (payload: T) => void) {
    listeners.push([event, callback as (payload: never) => void])
    if (current) entries.get(current)?.channel.listen(event, callback)
  }

  return { members, listen }
}
