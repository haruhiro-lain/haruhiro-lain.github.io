import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

let NavDropdownModule: typeof import('../NavDropdown.vue')

function makeItems() {
  return [
    { title: '题解', href: '/learning/algorithms' },
    { title: '项目', href: '/learning/projects' },
    { title: '杂项', href: '/learning/others' },
  ]
}

beforeEach(async () => {
  vi.resetModules()
  NavDropdownModule = await import('../NavDropdown.vue')
})

describe('NavDropdown', () => {
  it('渲染 label 按钮', () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    expect(wrapper.find('.nav-trigger').text()).toBe('笔记')
  })

  it('初始状态 aria-expanded 为 false', () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    expect(wrapper.find('.nav-trigger').attributes('aria-expanded')).toBe('false')
  })

  it('点击按钮打开菜单，aria-expanded 变为 true', async () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    await wrapper.find('.nav-trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.nav-trigger').attributes('aria-expanded')).toBe('true')
  })

  it('再次点击按钮关闭菜单', async () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    const trigger = wrapper.find('.nav-trigger')
    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')

    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('渲染所有菜单项', () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    const cards = wrapper.findAll('.submenu-card')
    expect(cards).toHaveLength(3)
    expect(cards[0].text()).toContain('题解')
    expect(cards[1].text()).toContain('项目')
    expect(cards[2].text()).toContain('杂项')
  })

  it('菜单项链接正确', () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    const links = wrapper.findAll('.submenu-card')
    expect(links[0].attributes('href')).toBe('/learning/algorithms')
  })

  it('鼠标进入时打开菜单', async () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    await wrapper.find('.nav-item').trigger('mouseenter')
    await nextTick()
    expect(wrapper.find('.nav-trigger').attributes('aria-expanded')).toBe('true')
  })

  it('extraClass 附加到根元素', () => {
    const wrapper = mount(NavDropdownModule.default, {
      props: {
        label: '动态',
        menuId: 'submenu-life',
        items: makeItems(),
        extraClass: 'nav-item--life',
      },
    })
    expect(wrapper.find('.nav-item').classes()).toContain('nav-item--life')
  })

  it('多个 NavDropdown 实例互斥：打开 B 会关闭 A', async () => {
    const wrapperA = mount(NavDropdownModule.default, {
      props: {
        label: '笔记',
        menuId: 'submenu-learning',
        items: makeItems(),
      },
    })
    const wrapperB = mount(NavDropdownModule.default, {
      props: {
        label: '动态',
        menuId: 'submenu-life',
        items: makeItems(),
      },
    })

    await wrapperA.find('.nav-trigger').trigger('click')
    await nextTick()
    expect(wrapperA.find('.nav-trigger').attributes('aria-expanded')).toBe('true')
    expect(wrapperB.find('.nav-trigger').attributes('aria-expanded')).toBe('false')

    await wrapperB.find('.nav-trigger').trigger('click')
    await nextTick()
    expect(wrapperA.find('.nav-trigger').attributes('aria-expanded')).toBe('false')
    expect(wrapperB.find('.nav-trigger').attributes('aria-expanded')).toBe('true')
  })
})
