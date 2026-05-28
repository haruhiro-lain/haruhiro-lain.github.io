<template>
  <div
    class="nav-item"
    :class="[extraClass, { 'is-open': isOpenComputed }]"
    ref="menuRoot"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusout="handleFocusOut"
    @keydown.escape="dropdown.closeAll"
  >
    <button
      class="nav-trigger"
      type="button"
      :aria-expanded="isOpenComputed"
      :aria-controls="menuId"
      @click.stop="handleTriggerClick"
    >
      {{ label }}
    </button>
    <div class="submenu submenu--cards" :id="menuId">
      <a
        v-for="item in items"
        :key="item.href"
        class="submenu-card"
        :href="item.href"
        @click="handleItemClick"
      >
        <h3>{{ item.title }}</h3>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useDropdownGroup } from '../composables/useDropdownGroup'

interface DropdownItem {
  title: string
  href: string
}

interface Props {
  label: string
  menuId: string
  items: DropdownItem[]
  extraClass?: string
}

const props = defineProps<Props>()

const dropdown = useDropdownGroup()
const menuRoot = ref<HTMLElement | null>(null)

const isOpenComputed = computed(() => dropdown.isOpen(props.menuId))

let closeTimer: ReturnType<typeof setTimeout> | null = null

function clearCloseTimer() {
  if (closeTimer !== null) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function handleTriggerClick() {
  clearCloseTimer()
  if (isOpenComputed.value) {
    dropdown.close(props.menuId)
  } else {
    dropdown.open(props.menuId)
  }
}

function handleMouseEnter() {
  clearCloseTimer()
  dropdown.open(props.menuId)
}

function handleMouseLeave() {
  closeTimer = setTimeout(() => {
    dropdown.close(props.menuId)
  }, 200)
}

function handleFocusOut() {
  nextTick(() => {
    if (!menuRoot.value?.contains(document.activeElement)) {
      dropdown.close(props.menuId)
    }
  })
}

function handleItemClick() {
  dropdown.closeAll()
}
</script>

<style scoped>
.nav-item {
  position: relative;
}

.nav-trigger {
  padding: 0.35em clamp(0.4rem, 1.8vw, 1.5em);
  font-size: 0.92rem;
  line-height: 1.4;
  color: rgb(var(--black));
  border-bottom: 4px solid transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  background: transparent;
  cursor: pointer;
}

.nav-item.is-open .nav-trigger {
  border-bottom-color: var(--accent);
}

.nav-item:hover .nav-trigger,
.nav-item:focus-within .nav-trigger {
  border-bottom-color: var(--accent);
}

.submenu {
  display: flex;
  position: absolute;
  left: 0;
  top: calc(100% + 0.25rem);
  background: var(--overlay-bg);
  backdrop-filter: blur(16px) saturate(130%);
  -webkit-backdrop-filter: blur(16px) saturate(130%);
  border: none;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.28);
  border-radius: 8px;
  padding: 0.3em 0.15em;
  min-width: 75px;
  flex-direction: column;
  z-index: 1100;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.15s ease 0.3s,
    visibility 0s linear 0.35s;
}

.nav-item.is-open .submenu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0s, 0s;
}

.nav-item:hover .submenu,
.nav-item:focus-within .submenu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0s, 0s;
}

.submenu--cards {
  min-width: 80px;
  padding: 0.2rem 0.12rem;
  gap: 0.2rem;
}

.submenu-card {
  display: block;
  padding: 0.27rem 0.12rem;
  border-bottom: none;
  border-radius: 6px;
  color: rgb(var(--black));
  text-decoration: none;
}

.submenu-card:hover {
  background: rgba(var(--gray-light), 0.35);
}

.submenu-card h3 {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.2;
}
</style>
