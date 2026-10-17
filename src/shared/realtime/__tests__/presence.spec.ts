import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { getRealtime } from '../echo'
import { usePresenceChannel, type PresenceMember } from '../presence'

vi.mock('../echo', () => ({ getRealtime: vi.fn<() => unknown>() }))

type Handler = (payload: never) => void

/** Canal falso de Echo: guarda los callbacks para poder dispararlos desde el test. */
function fakeEcho() {
  const handlers: Record<string, Handler> = {}
  const channel: Record<string, unknown> = {}
  const register = (key: string) =>
    vi.fn<(cb: Handler) => unknown>((cb) => {
      handlers[key] = cb
      return channel
    })
  Object.assign(channel, {
    here: register('here'),
    joining: register('joining'),
    leaving: register('leaving'),
    listen: vi.fn<(event: string, cb: Handler) => unknown>((event, cb) => {
      handlers[event] = cb
      return channel
    }),
    stopListening: vi.fn<() => unknown>(() => channel),
  })
  const echo = {
    join: vi.fn<(name: string) => unknown>(() => channel),
    leave: vi.fn<(name: string) => void>(),
  }
  vi.mocked(getRealtime).mockReturnValue(echo as never)
  return { echo, handlers }
}

const user = (id: number): PresenceMember => ({ id, name: `U${id}`, avatar_url: null })

function mountUser(name = 'booking.7') {
  let api!: ReturnType<typeof usePresenceChannel>
  const wrapper = mount(
    defineComponent({
      setup() {
        api = usePresenceChannel(name)
        return () => h('div')
      },
    }),
  )
  return { wrapper, api: () => api }
}

describe('usePresenceChannel', () => {
  beforeEach(() => vi.mocked(getRealtime).mockReset())

  it('shares one subscription and leaves only when the last user unmounts', () => {
    const { echo } = fakeEcho()
    const first = mountUser()
    const second = mountUser()

    expect(echo.join).toHaveBeenCalledTimes(1)

    first.wrapper.unmount()
    expect(echo.leave).not.toHaveBeenCalled()

    second.wrapper.unmount()
    expect(echo.leave).toHaveBeenCalledWith('booking.7')
  })

  it('tracks who is connected', async () => {
    const { handlers } = fakeEcho()
    const { api, wrapper } = mountUser('booking.8')

    handlers.here!([user(1), user(2)] as never)
    await nextTick()
    expect(api().members.value.map((m) => m.id)).toEqual([1, 2])

    handlers.leaving!(user(2) as never)
    handlers.joining!(user(3) as never)
    await nextTick()
    expect(api().members.value.map((m) => m.id)).toEqual([1, 3])
    wrapper.unmount()
  })

  it('does nothing without a realtime connection', () => {
    vi.mocked(getRealtime).mockReturnValue(null)
    const { api, wrapper } = mountUser('booking.9')

    expect(api().members.value).toEqual([])
    wrapper.unmount()
  })
})
