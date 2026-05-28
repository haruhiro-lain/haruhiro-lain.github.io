import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'focus-mode'

type FocusMode = 'on' | 'off'

const focusMode = ref<FocusMode>('on')

function syncFromDOM() {
  if (typeof document === 'undefined') return
  const attr = document.documentElement.getAttribute('data-focus-mode')
  if (attr === 'on' || attr === 'off') {
    focusMode.value = attr
  }
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
  })

  const toggleFocusMode = () => {
    focusMode.value = focusMode.value === 'on' ? 'off' : 'on'
  }

  return {
    focusMode,
    toggleFocusMode,
  }
}
