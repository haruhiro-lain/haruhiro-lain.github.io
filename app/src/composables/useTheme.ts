/**
 * 主题管理 composable
 *
 * 职责：
 * - 管理深色/浅色主题切换（localStorage 持久化）
 * - VA-11 Hall-A 页面强制深色模式（使用 MutationObserver 锁定）
 * - 离开 VA 页面时恢复用户之前的主题偏好
 *
 * 注意：PageShell.astro 中有对应的内联脚本（is:inline），在 Vue 挂载前
 * 设置 data-theme 属性以防止 FOUC。本 composable 负责挂载后的交互式切换。
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

/** 主题选择的 localStorage key */
const STORAGE_KEY = 'theme-preference'
/** VA-11 Hall-A 锁定前保存原始偏好的临时 key */
const LOCK_KEY = 'va-theme-saved'

type Theme = 'light' | 'dark'

/** 当前主题（模块级，所有 useTheme() 调用者共享） */
const theme = ref<Theme>('dark')
/** 是否处于 VA-11 Hall-A 页面强制深色模式 */
const isVaThemeLocked = ref(false)

/** 将主题应用到 document.documentElement 的 data-theme 属性 */
function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t)
  }
}

/** 获取用户偏好主题：localStorage > 系统偏好 > 默认深色 */
function getPreferredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'dark'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark'
  return 'dark'
}

export function useTheme() {
  let observer: MutationObserver | null = null

  onMounted(() => {
    const path = window.location.pathname
    const isVA = path.indexOf('/life/VA-11_Hall-A') === 0

    if (isVA) {
      // VA-11 Hall-A 页面：强制深色并锁定
      isVaThemeLocked.value = true
      theme.value = 'dark'
      applyTheme('dark')
      localStorage.setItem(STORAGE_KEY, 'dark')

      // 监听 data-theme 属性变化，防止其他代码意外修改
      observer = new MutationObserver(() => {
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
          theme.value = 'dark'
          applyTheme('dark')
        }
      })
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })
    } else {
      // 普通页面：同步当前 DOM 状态或应用用户偏好
      const currentDom = document.documentElement.getAttribute('data-theme')
      if (currentDom === 'light' || currentDom === 'dark') {
        theme.value = currentDom
      } else {
        const preferred = getPreferredTheme()
        theme.value = preferred
        applyTheme(preferred)
      }
    }
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    // 离开 VA 页面时恢复用户之前的主题偏好
    if (isVaThemeLocked.value) {
      const prev = localStorage.getItem(LOCK_KEY)
      if (prev) {
        localStorage.setItem(STORAGE_KEY, prev)
        applyTheme(prev as Theme)
      }
      localStorage.removeItem(LOCK_KEY)
    }
  })

  /** 切换深色/浅色（VA 锁定状态下禁用） */
  const toggleTheme = () => {
    if (isVaThemeLocked.value) return
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  // 主题变化时同步 DOM 和 localStorage
  watch(theme, (t) => {
    applyTheme(t)
    if (!isVaThemeLocked.value) {
      localStorage.setItem(STORAGE_KEY, t)
    }
  })

  return { theme, toggleTheme, isVaThemeLocked }
}
