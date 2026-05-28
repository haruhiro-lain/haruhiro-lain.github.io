import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useClickOutside(
  elRef: Ref<HTMLElement | null | undefined>,
  callback: () => void,
) {
  const handler = (event: PointerEvent) => {
    if (!elRef.value) return
    if (!(event.target instanceof Node)) return
    if (elRef.value.contains(event.target)) return
    callback()
  }

  onMounted(() => {
    document.addEventListener('pointerdown', handler)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handler)
  })
}
