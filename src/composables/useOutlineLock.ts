import { ref, onMounted, onBeforeUnmount } from 'vue'

const outlineLocked = ref(false)

export function useOutlineLock() {
  const toggleLock = () => {
    outlineLocked.value = !outlineLocked.value
    window.dispatchEvent(
      new CustomEvent('outline-lock-toggle', {
        detail: { locked: outlineLocked.value },
      }),
    )
  }

  const handleLockStateChange = (event: Event) => {
    if (!(event instanceof CustomEvent)) return
    outlineLocked.value = event.detail?.locked === true
  }

  onMounted(() => {
    window.addEventListener('outline-lock-state-change', handleLockStateChange)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('outline-lock-state-change', handleLockStateChange)
  })

  return {
    outlineLocked,
    toggleLock,
  }
}
