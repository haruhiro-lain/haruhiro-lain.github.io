import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'focus-mode'
const UNLOCK_KEY = 'focus-unlocked'
const UNLOCK_PASSWORD = '123123'

type FocusMode = 'on' | 'off'

const focusMode = ref<FocusMode>('on')
const focusUnlocked = ref(false)

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

function applyFocusMode(mode: FocusMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-focus-mode', mode)
  }
}

watch(focusMode, (mode) => {
  applyFocusMode(mode)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode)
  }
})

export function useFocusMode() {
  onMounted(() => {
    syncFromDOM()
    syncUnlocked()
  })

  const toggleFocusMode = () => {
    if (!focusUnlocked.value) return
    focusMode.value = focusMode.value === 'on' ? 'off' : 'on'
  }

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

  return {
    focusMode,
    focusUnlocked,
    toggleFocusMode,
    tryUnlockFocus,
    lockFocus,
  }
}
