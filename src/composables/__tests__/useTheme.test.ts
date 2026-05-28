import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

let themeModule: typeof import('../useTheme')

beforeEach(async () => {
  vi.resetModules()
  document.documentElement.removeAttribute('data-theme')
  localStorage.clear()
  vi.clearAllMocks()
  themeModule = await import('../useTheme')
})

describe('useTheme', () => {
  it('返回 theme, toggleTheme, isVaThemeLocked', () => {
    const { theme, toggleTheme, isVaThemeLocked } = themeModule.useTheme()
    expect(typeof toggleTheme).toBe('function')
    expect(theme.value === 'light' || theme.value === 'dark').toBe(true)
    expect(typeof isVaThemeLocked.value).toBe('boolean')
  })

  it('不在 VA 页面时 isVaThemeLocked 为 false', () => {
    window.location.pathname = '/about'
    const { isVaThemeLocked } = themeModule.useTheme()
    expect(isVaThemeLocked.value).toBe(false)
  })

  it('toggleTheme 在非锁定状态下切换主题', () => {
    window.location.pathname = '/'
    const { theme, toggleTheme } = themeModule.useTheme()
    const before = theme.value
    toggleTheme()
    expect(theme.value).not.toBe(before)
    expect(theme.value === 'light' || theme.value === 'dark').toBe(true)
  })

  it('切换主题后将值写入 localStorage', async () => {
    window.location.pathname = '/'
    const { toggleTheme } = themeModule.useTheme()
    toggleTheme()
    await nextTick()
    const stored = localStorage.getItem('theme-preference')
    expect(stored === 'light' || stored === 'dark').toBe(true)
  })

  it('切换主题后更新 DOM data-theme 属性', async () => {
    window.location.pathname = '/'
    const { toggleTheme } = themeModule.useTheme()
    toggleTheme()
    await nextTick()
    const attr = document.documentElement.getAttribute('data-theme')
    expect(attr === 'light' || attr === 'dark').toBe(true)
  })
})
