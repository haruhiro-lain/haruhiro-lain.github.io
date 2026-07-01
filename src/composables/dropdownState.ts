/**
 * 下拉菜单共享状态
 *
 * NavDropdown 多实例间通过此模块级 ref 实现互斥：
 * 同一时间只有一个下拉菜单可以展开。
 */
import { ref } from 'vue'

/** 当前展开的下拉菜单 ID，null 表示全部关闭 */
export const activeDropdownId = ref<string | null>(null)

/** 打开指定下拉菜单（自动关闭其他） */
export function openDropdown(id: string) {
  activeDropdownId.value = id
}

/** 关闭指定下拉菜单（仅当它是当前展开的） */
export function closeDropdown(id: string) {
  if (activeDropdownId.value === id) {
    activeDropdownId.value = null
  }
}

/** 关闭所有下拉菜单 */
export function closeAllDropdowns() {
  activeDropdownId.value = null
}

/** 判断指定下拉菜单是否展开 */
export function isDropdownOpen(id: string) {
  return activeDropdownId.value === id
}
