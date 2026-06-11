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
  it('返回 focusMode, focusUnlocked, toggleFocusMode 和 tryUnlockFocus', () => {
    const { focusMode, focusUnlocked, toggleFocusMode, tryUnlockFocus } = useFocusModule.useFocusMode()
    expect(focusMode.value).toBe('on')
    expect(focusUnlocked.value).toBe(false)
    expect(typeof toggleFocusMode).toBe('function')
    expect(typeof tryUnlockFocus).toBe('function')
  })

  it('初始值为 on', () => {
    const { focusMode } = useFocusModule.useFocusMode()
    expect(focusMode.value).toBe('on')
  })

  it('未解锁时 toggleFocusMode 不生效', () => {
    const { focusMode, focusUnlocked, toggleFocusMode } = useFocusModule.useFocusMode()
    expect(focusUnlocked.value).toBe(false)
    toggleFocusMode()
    expect(focusMode.value).toBe('on')
  })

  it('tryUnlockFocus 使用错误密码返回 false', () => {
    const { focusUnlocked, tryUnlockFocus } = useFocusModule.useFocusMode()
    const result = tryUnlockFocus('wrong')
    expect(result).toBe(false)
    expect(focusUnlocked.value).toBe(false)
  })

  it('tryUnlockFocus 使用正确密码返回 true 并解锁', () => {
    const { focusUnlocked, tryUnlockFocus } = useFocusModule.useFocusMode()
    const result = tryUnlockFocus('123123')
    expect(result).toBe(true)
    expect(focusUnlocked.value).toBe(true)
    expect(localStorage.getItem('focus-unlocked')).toBe('true')
  })

  it('解锁后 toggleFocusMode 从 on 切换到 off', () => {
    const { focusMode, toggleFocusMode, tryUnlockFocus } = useFocusModule.useFocusMode()
    tryUnlockFocus('123123')
    toggleFocusMode()
    expect(focusMode.value).toBe('off')
  })

  it('解锁后从 off 再次切换回到 on', () => {
    const { focusMode, toggleFocusMode, tryUnlockFocus } = useFocusModule.useFocusMode()
    tryUnlockFocus('123123')
    toggleFocusMode()
    toggleFocusMode()
    expect(focusMode.value).toBe('on')
  })

  it('切换后将状态写入 localStorage', async () => {
    const { toggleFocusMode, tryUnlockFocus } = useFocusModule.useFocusMode()
    tryUnlockFocus('123123')
    toggleFocusMode()
    await nextTick()
    expect(localStorage.getItem('focus-mode')).toBe('off')
  })

  it('DOM 属性在切换时更新', async () => {
    const { toggleFocusMode, tryUnlockFocus } = useFocusModule.useFocusMode()
    tryUnlockFocus('123123')
    toggleFocusMode()
    await nextTick()
    expect(document.documentElement.getAttribute('data-focus-mode')).toBe('off')
  })
})
