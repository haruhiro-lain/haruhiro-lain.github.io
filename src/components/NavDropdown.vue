<template>
  <div
    class="nav-item"
    :class="[extraClass, { 'is-open': isOpenComputed }]"
    ref="menuRoot"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusout="handleFocusOut"
    @keydown.escape="closeAllDropdowns"
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
        :class="['submenu-card', item.extraClass]"
        :href="item.href"
        @click="handleItemClick"
      >
        <h3>{{ item.title }}</h3>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * NavDropdown - 导航栏下拉菜单组件
 *
 * 支持鼠标悬停展开、点击切换、焦点离开关闭。
 * 多个实例通过 dropdownState 模块级 ref 共享状态，确保同时只有一个展开。
 */
import { ref, computed, nextTick } from 'vue'
import { isDropdownOpen, openDropdown, closeDropdown, closeAllDropdowns } from '../composables/dropdownState'

// ---- 组件 Props ----

interface DropdownItem {
  title: string
  href: string
  extraClass?: string
}

interface Props {
  label: string
  menuId: string
  items: DropdownItem[]
  extraClass?: string
}

const props = defineProps<Props>()

// ---- 实例状态 ----

const menuRoot = ref<HTMLElement | null>(null)
const isOpenComputed = computed(() => isDropdownOpen(props.menuId))

let closeTimer: ReturnType<typeof setTimeout> | null = null

function clearCloseTimer() {
  if (closeTimer !== null) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

// ---- 事件处理 ----

function handleTriggerClick() {
  clearCloseTimer()
  if (isOpenComputed.value) {
    closeDropdown(props.menuId)
  } else {
    openDropdown(props.menuId)
  }
}

function handleMouseEnter() {
  clearCloseTimer()
  openDropdown(props.menuId)
}

function handleMouseLeave() {
  closeTimer = setTimeout(() => {
    closeDropdown(props.menuId)
  }, 200)
}

function handleFocusOut() {
  nextTick(() => {
    if (!menuRoot.value?.contains(document.activeElement)) {
      closeDropdown(props.menuId)
    }
  })
}

function handleItemClick() {
  closeAllDropdowns()
}
</script>

<style scoped>
.nav-item {
  position: relative;
}

.nav-trigger {
  padding: 0.35em clamp(0.4rem, 1.8vw, 1.5em);
  font-size: 0.92rem;
  font-family: inherit;
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
