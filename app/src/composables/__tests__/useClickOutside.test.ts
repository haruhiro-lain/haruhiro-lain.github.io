import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useClickOutside } from '../useClickOutside'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

function mountUseClickOutside(
  elRef: ReturnType<typeof ref<HTMLElement | null>>,
  callback: () => void,
) {
  const wrapper = mount(
    defineComponent({
      setup() {
        useClickOutside(elRef, callback)
        return () => h('div')
      },
    }),
  )
  return wrapper
}

describe('useClickOutside', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('注册 pointerdown 事件监听器', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    const elRef = ref<HTMLElement | null>(null)
    const callback = vi.fn()

    mountUseClickOutside(elRef, callback)
    expect(addSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function))

    addSpy.mockRestore()
  })

  it('当 elRef 为 null 时不触发回调', () => {
    const elRef = ref<HTMLElement | null>(null)
    const callback = vi.fn()

    mountUseClickOutside(elRef, callback)
    document.dispatchEvent(new PointerEvent('pointerdown'))
    expect(callback).not.toHaveBeenCalled()
  })
})
