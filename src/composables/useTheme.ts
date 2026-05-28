import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const STORAGE_KEY = 'theme-preference'
const LOCK_KEY = 'va-theme-saved'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark')
const isVaThemeLocked = ref(false)

function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t)
  }
}

function getPreferredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark'
  return 'light'
}

export function useTheme() {
  let observer: MutationObserver | null = null

  onMounted(() => {
    const path = window.location.pathname
    const isVA = path.indexOf('/life/VA-11_Hall-A') === 0

    if (isVA) {
      isVaThemeLocked.value = true
      theme.value = 'dark'
      applyTheme('dark')
      localStorage.setItem(STORAGE_KEY, 'dark')

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
    if (isVaThemeLocked.value) {
      const prev = localStorage.getItem(LOCK_KEY)
      if (prev) {
        localStorage.setItem(STORAGE_KEY, prev)
        applyTheme(prev as Theme)
      }
      localStorage.removeItem(LOCK_KEY)
    }
  })

  const toggleTheme = () => {
    if (isVaThemeLocked.value) return
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(theme, (t) => {
    applyTheme(t)
    if (!isVaThemeLocked.value) {
      localStorage.setItem(STORAGE_KEY, t)
    }
  })

  return { theme, toggleTheme, isVaThemeLocked }
}
