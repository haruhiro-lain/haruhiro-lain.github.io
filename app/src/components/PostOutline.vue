<template>
  <aside
    v-if="headings.length > 0"
    ref="outlineRef"
    class="post-outline"
    aria-label="文章大纲"
    tabindex="0"
    :class="{ 'is-open': isOpen, 'is-locked': isLocked }"
    @mouseenter="open"
    @mouseleave="closeWithDelay"
    @focusin="open"
    @focusout="handleFocusOut"
  >
    <div class="post-outline__inner" @click="handleInnerClick">
      <ul class="post-outline__list">
        <li
          v-for="heading in headings"
          :key="heading.slug"
          :class="[
            'post-outline__item',
            heading.depth >= 3 && 'post-outline__item--nested',
          ]"
        >
          <a
            :href="`#${heading.slug}`"
            :class="{ 'is-active': activeSlug === heading.slug }"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useOutlineLock } from '../composables/useOutlineLock'

interface HeadingItem {
  slug: string
  text: string
  depth: number
}

interface Props {
  headings: HeadingItem[]
}

defineProps<Props>()

const CLOSE_DELAY_MS = 200

const { outlineLocked } = useOutlineLock()

const outlineRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const isLocked = ref(false)
const activeSlug = ref('')

let closeTimer: ReturnType<typeof setTimeout> | null = null

function clearCloseTimer() {
  if (closeTimer !== null) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function open() {
  clearCloseTimer()
  isOpen.value = true
}

function closeWithDelay() {
  if (isLocked.value) return
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    if (isLocked.value) return
    isOpen.value = false
    closeTimer = null
  }, CLOSE_DELAY_MS)
}

function setLock(value: boolean) {
  isLocked.value = value
  outlineLocked.value = value
  if (value) {
    open()
  } else {
    clearCloseTimer()
    isOpen.value = false
  }
}

function handleInnerClick(event: MouseEvent) {
  const target = event.target
  if (target instanceof Element && target.closest('a')) return
  setLock(!isLocked.value)
}

function handleFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && outlineRef.value?.contains(nextTarget)) return
  closeWithDelay()
}

watch(outlineLocked, (val) => {
  setLock(val)
})

let observer: IntersectionObserver | null = null

function setupScrollSpy() {
  if (typeof IntersectionObserver === 'undefined') return
  const headingIds = document.querySelectorAll(
    '.prose h2[id], .prose h3[id]',
  )
  if (headingIds.length === 0) return

  const options: IntersectionObserverInit = {
    rootMargin: '-80px 0px -66% 0px',
    threshold: 0,
  }

  observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .map((e) => e.target.id)
    if (visible.length > 0) {
      activeSlug.value = visible[0]
    }
  }, options)

  headingIds.forEach((el) => observer?.observe(el))
}

onMounted(() => {
  nextTick(() => {
    setupScrollSpy()
  })
})

onBeforeUnmount(() => {
  clearCloseTimer()
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
