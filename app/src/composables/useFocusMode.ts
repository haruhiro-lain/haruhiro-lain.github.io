/**
 * 专注模式 & 内容解锁管理
 *
 * 管理两种状态：
 *   1. focusMode — 控制首页是否显示生活类内容（'on' = 只显示学习）
 *   2. todoUnlocked — 控制 TO-DO 草稿页是否可见
 *
 * 解锁需要密码（UNLOCK_PASSWORD），状态持久化到 localStorage。
 * PageShell.astro 的内联脚本负责在页面加载前从 localStorage 读取并
 * 设置 data-* 属性，本 composable 负责挂载后的交互式管理。
 */
import { ref, watch, onMounted } from 'vue'

/** 专注模式的 localStorage key */
const STORAGE_KEY = 'focus-mode'
/** 专注模式解锁标记 key */
const UNLOCK_KEY = 'focus-unlocked'
/** TO-DO 解锁标记 key */
const TODO_UNLOCK_KEY = 'todo-unlocked'
/** 解锁密码 */
const UNLOCK_PASSWORD = '123123'

type FocusMode = 'on' | 'off'

/** 当前专注模式状态 */
const focusMode = ref<FocusMode>('on')
/** 专注模式是否已解锁（允许切换生活内容可见性） */
const focusUnlocked = ref(false)
/** TO-DO 草稿是否解锁可见 */
const todoUnlocked = ref(false)

// ---- 内部辅助：DOM / localStorage 同步 ----

function syncFromDOM() {
  if (typeof document === 'undefined') return
  const attr = document.documentElement.getAttribute('data-focus-mode')
  if (attr === 'on' || attr === 'off') {
    focusMode.value = attr
  }
}

function syncUnlocked() {
  if (typeof localStorage === 'undefined') return
  focusUnlocked.value = localStorage.getItem(UNLOCK_KEY) === 'true'
}

function syncTodoUnlocked() {
  if (typeof localStorage === 'undefined') return
  todoUnlocked.value = localStorage.getItem(TODO_UNLOCK_KEY) === 'true'
}

function applyFocusMode(mode: FocusMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-focus-mode', mode)
  }
}

// 专注模式变化时同步 DOM 和 localStorage
watch(focusMode, (mode) => {
  applyFocusMode(mode)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode)
  }
})

// ---- 导出 composable ----

export function useFocusMode() {
  onMounted(() => {
    syncFromDOM()
    syncUnlocked()
    syncTodoUnlocked()
  })

  // ======== 专注模式 ========

  /** 切换专注模式（仅在已解锁时有效） */
  const toggleFocusMode = () => {
    if (!focusUnlocked.value) return
    focusMode.value = focusMode.value === 'on' ? 'off' : 'on'
  }

  /** 尝试解锁专注模式 */
  const tryUnlockFocus = (password: string): boolean => {
    if (password === UNLOCK_PASSWORD) {
      focusUnlocked.value = true
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(UNLOCK_KEY, 'true')
      }
      return true
    }
    return false
  }

  /** 锁定专注模式（恢复为 'on'，隐藏生活内容） */
  const lockFocus = () => {
    focusUnlocked.value = false
    focusMode.value = 'on'
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(UNLOCK_KEY)
      localStorage.setItem(STORAGE_KEY, 'on')
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-focus-mode', 'on')
    }
  }

  // ======== TO-DO 解锁 ========

  /** 尝试解锁 TO-DO 草稿页 */
  const tryUnlockTodo = (password: string): boolean => {
    if (password === UNLOCK_PASSWORD) {
      todoUnlocked.value = true
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(TODO_UNLOCK_KEY, 'true')
      }
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-todo-mode', 'on')
      }
      return true
    }
    return false
  }

  /** 锁定 TO-DO 草稿页 */
  const lockTodo = () => {
    todoUnlocked.value = false
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TODO_UNLOCK_KEY)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-todo-mode', 'off')
    }
  }

  return {
    focusMode,
    focusUnlocked,
    todoUnlocked,
    toggleFocusMode,
    tryUnlockFocus,
    lockFocus,
    tryUnlockTodo,
    lockTodo,
  }
}
