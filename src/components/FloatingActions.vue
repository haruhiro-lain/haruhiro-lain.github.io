<template>
  <div class="floating-actions">
    <button
      class="floating-btn"
      :class="{ 'is-active': outlineLocked }"
      type="button"
      :aria-pressed="outlineLocked"
      :aria-label="outlineLocked ? '收起侧边栏' : '展开侧边栏'"
      @click="toggleOutlineLock"
    >
      ≡
    </button>

    <button
      class="floating-btn"
      type="button"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      ↑
    </button>

    <button
      class="floating-btn"
      :class="{ 'va-theme-locked': isVaThemeLocked }"
      type="button"
      :aria-label="isVaThemeLocked ? '主题已锁定为深色' : (theme === 'dark' ? '当前深色，点击切换到浅色' : '当前浅色，点击切换到深色')"
      @click="toggleTheme"
    >
      🌙
    </button>

    <button
      class="floating-btn"
      type="button"
      :aria-pressed="focusMode === 'on'"
      :aria-label="focusMode === 'on' ? '专注模式已开启' : '专注模式已关闭'"
      @click="toggleFocusMode"
    >
      {{ focusMode === 'on' ? '📚' : '🎮' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useFocusMode } from '../composables/useFocusMode'
import { useOutlineLock } from '../composables/useOutlineLock'

const { theme, toggleTheme, isVaThemeLocked } = useTheme()
const { focusMode, toggleFocusMode } = useFocusMode()
const { outlineLocked, toggleLock: toggleOutlineLock } = useOutlineLock()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.floating-actions {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  z-index: 1200;
}

.floating-btn {
  width: 2.4rem;
  height: 2.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 10px;
  border: 1px solid var(--floating-btn-border);
  background: var(--overlay-bg-strong);
  color: rgb(var(--black));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  font: inherit;
  font-size: 1rem;
  line-height: 1;
  box-shadow: var(--box-shadow);
}

.floating-btn:hover {
  transform: translateY(-1px);
}

.floating-btn.is-active {
  background: var(--overlay-card);
  border-color: var(--accent);
}

.floating-btn.va-theme-locked {
  opacity: 0.45;
  cursor: not-allowed !important;
}
</style>
