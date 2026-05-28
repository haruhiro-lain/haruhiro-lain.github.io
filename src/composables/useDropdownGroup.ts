import { ref } from 'vue'

const activeDropdownId = ref<string | null>(null)

export function useDropdownGroup() {
  const open = (id: string) => {
    activeDropdownId.value = id
  }

  const close = (id: string) => {
    if (activeDropdownId.value === id) {
      activeDropdownId.value = null
    }
  }

  const closeAll = () => {
    activeDropdownId.value = null
  }

  const isOpen = (id: string) => activeDropdownId.value === id

  return {
    open,
    close,
    closeAll,
    isOpen,
  }
}
