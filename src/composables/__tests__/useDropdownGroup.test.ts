import { describe, it, expect, vi, beforeEach } from 'vitest'

let dropdownModule: typeof import('../useDropdownGroup')

beforeEach(async () => {
  vi.resetModules()
  dropdownModule = await import('../useDropdownGroup')
})

describe('useDropdownGroup', () => {
  it('初始状态时没有下拉菜单打开', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    expect(dropdown.isOpen('menu-1')).toBe(false)
    expect(dropdown.isOpen('menu-2')).toBe(false)
  })

  it('open 后 isOpen 返回 true', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    dropdown.open('menu-1')
    expect(dropdown.isOpen('menu-1')).toBe(true)
  })

  it('打开 menu-1 后 menu-2 仍为关闭', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    dropdown.open('menu-1')
    expect(dropdown.isOpen('menu-2')).toBe(false)
  })

  it('切换打开不同菜单时，之前的菜单自动关闭（互斥）', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    dropdown.open('menu-1')
    expect(dropdown.isOpen('menu-1')).toBe(true)

    dropdown.open('menu-2')
    expect(dropdown.isOpen('menu-1')).toBe(false)
    expect(dropdown.isOpen('menu-2')).toBe(true)
  })

  it('close 关闭指定菜单', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    dropdown.open('menu-1')
    dropdown.close('menu-1')
    expect(dropdown.isOpen('menu-1')).toBe(false)
  })

  it('close 只关闭匹配的 id，不影响其他', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    dropdown.open('menu-1')
    dropdown.close('menu-2')
    expect(dropdown.isOpen('menu-1')).toBe(true)
  })

  it('closeAll 关闭所有菜单', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    dropdown.open('menu-1')
    dropdown.closeAll()
    expect(dropdown.isOpen('menu-1')).toBe(false)
  })

  it('重复 open 同一个菜单保持打开', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    dropdown.open('menu-1')
    dropdown.open('menu-1')
    expect(dropdown.isOpen('menu-1')).toBe(true)
  })

  it('多组件实例共享同一模块级状态', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    const dropdown2 = dropdownModule.useDropdownGroup()
    dropdown.open('shared-menu')
    expect(dropdown2.isOpen('shared-menu')).toBe(true)
  })

  it('closeAll 影响所有组件实例', () => {
    const dropdown = dropdownModule.useDropdownGroup()
    const dropdown2 = dropdownModule.useDropdownGroup()
    dropdown.open('shared-menu')
    dropdown2.closeAll()
    expect(dropdown.isOpen('shared-menu')).toBe(false)
    expect(dropdown2.isOpen('shared-menu')).toBe(false)
  })
})
