<template>
  <nav
    v-if="totalPages > 1"
    class="section-pagination"
    aria-label="分页导航"
  >
    <button
      class="pagination-btn"
      type="button"
      :disabled="currentPage <= 1"
      @click="goTo(currentPage - 1)"
    >
      上一页
    </button>
    <span id="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
    <button
      class="pagination-btn"
      type="button"
      :disabled="currentPage >= totalPages"
      @click="goTo(currentPage + 1)"
    >
      下一页
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  listSelector: string
  itemSelector: string
  pageSize: number
}

const props = defineProps<Props>()

const currentPage = ref(1)
const totalPages = ref(1)

function render() {
  if (typeof document === 'undefined') return
  const list = document.querySelector(props.listSelector)
  if (!list) return
  const items = list.querySelectorAll<HTMLElement>(props.itemSelector)
  totalPages.value = Math.ceil(items.length / props.pageSize)
  items.forEach((item, i) => {
    const page = Math.floor(i / props.pageSize) + 1
    item.hidden = page !== currentPage.value
  })
}

function goTo(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  render()
})
</script>
