import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

let useFocusModule: typeof import('../useFocusMode')

beforeEach(async () => {
  vi.resetModules()
  document.documentElement.removeAttribute('data-focus-mode')
  localStorage.clear()
  vi.clearAllMocks()
  useFocusModule = await import('../useFocusMode')
})

describe('useFocusMode', () => {
  it('返回 focusMode ref 和 toggleFocusMode 方法', () => {
    const { focusMode, toggleFocusMode } = useFocusModule.useFocusMode()
    expect(focusMode.value).toBe('on')
    expect(typeof toggleFocusMode).toBe('function')
  })

  it('初始值为 on', () => {
    const { focusMode } = useFocusModule.useFocusMode()
    expect(focusMode.value).toBe('on')
  })

  it('toggleFocusMode 从 on 切换到 off', () => {
    const { focusMode, toggleFocusMode } = useFocusModule.useFocusMode()
    toggleFocusMode()
    expect(focusMode.value).toBe('off')
  })

  it('从 off 再次切换回到 on', () => {
    const { focusMode, toggleFocusMode } = useFocusModule.useFocusMode()
    toggleFocusMode()
    toggleFocusMode()
    expect(focusMode.value).toBe('on')
  })

  it('切换后将状态写入 localStorage', async () => {
    const { toggleFocusMode } = useFocusModule.useFocusMode()
    toggleFocusMode()
    await nextTick()
    expect(localStorage.getItem('focus-mode')).toBe('off')
  })

  it('DOM 属性在切换时更新', async () => {
    const { toggleFocusMode } = useFocusModule.useFocusMode()
    toggleFocusMode()
    await nextTick()
    expect(document.documentElement.getAttribute('data-focus-mode')).toBe('off')
  })
})
