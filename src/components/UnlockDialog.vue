<template>
  <div ref="sectionRef" class="unlock-section">
    <div class="unlock-buttons">
      <button
        v-if="privateUnlocked"
        ref="privateBtnRef"
        class="unlock-btn"
        type="button"
        aria-label="锁定不是不是"
        @click="lockPrivate"
      >
        🔓不是不是
      </button>
      <button
        v-else
        ref="privateBtnRef"
        class="unlock-btn"
        :class="{ 'unlock-btn--active': privateExpanded }"
        type="button"
        aria-label="解锁不是不是"
        @click="togglePrivate"
      >
        🔒不是不是
      </button>
    </div>

    <div v-if="privateExpanded" class="unlock-form-row" :style="{ paddingLeft: formLeft }">
      <form class="unlock-form" @submit.prevent="submitPrivate">
        <input
          ref="privateInputRef"
          v-model="privatePassword"
          class="unlock-input"
          :class="{ 'has-error': privateError }"
          type="password"
          placeholder="输入密码"
          aria-label="解锁不是不是密码"
          autocomplete="off"
        />
        <button class="unlock-submit" type="submit" :disabled="!privatePassword">确认</button>
        <button class="unlock-cancel" type="button" @click="cancelPrivate">取消</button>
        <p v-if="privateError" class="unlock-error">{{ privateError }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useFocusMode } from '../composables/useFocusMode'

const {
  focusMode,
  focusUnlocked,
  todoUnlocked,
  tryUnlockFocus,
  lockFocus,
  toggleFocusMode,
  tryUnlockTodo,
  lockTodo,
} = useFocusMode()

const privateExpanded = ref(false)
const privatePassword = ref('')
const privateError = ref('')
const privateInputRef = ref<HTMLInputElement | null>(null)

const sectionRef = ref<HTMLElement | null>(null)
const privateBtnRef = ref<HTMLButtonElement | null>(null)
const formLeft = ref('0')

const privateUnlocked = computed(() => focusUnlocked.value && todoUnlocked.value)

function syncFormLeft() {
  nextTick(() => {
    if (privateBtnRef.value && sectionRef.value) {
      const btnRect = privateBtnRef.value.getBoundingClientRect()
      const sectionRect = sectionRef.value.getBoundingClientRect()
      formLeft.value = (btnRect.left - sectionRect.left) + 'px'
    }
  })
}

function togglePrivate() {
  if (privateExpanded.value) {
    cancelPrivate()
    return
  }

  privateExpanded.value = true
  privateError.value = ''
  privatePassword.value = ''
  syncFormLeft()
  nextTick(() => privateInputRef.value?.focus())
}

function cancelPrivate() {
  privateExpanded.value = false
  privateError.value = ''
  privatePassword.value = ''
}

function lockPrivate() {
  lockTodo()
  lockFocus()
  cancelPrivate()
}

function submitPrivate() {
  const focusOk = tryUnlockFocus(privatePassword.value)
  const todoOk = tryUnlockTodo(privatePassword.value)

  if (focusOk && todoOk) {
    privateError.value = ''
    privateExpanded.value = false
    if (focusMode.value === 'on') {
      toggleFocusMode()
    }
    return
  }

  privateError.value = '密码错误'
  privatePassword.value = ''
  privateInputRef.value?.focus()
}
</script>

<style scoped>
.unlock-section {
  margin-top: 2rem;
  padding-bottom: 1rem;
}

.unlock-buttons {
  display: flex;
  gap: 0.6rem;
}

.unlock-form-row {
  margin-top: 0.45rem;
}

.unlock-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 1rem;
  border: 1px solid var(--overlay-border);
  border-radius: 999px;
  background: transparent;
  color: rgb(var(--gray));
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.unlock-btn:hover {
  color: rgb(var(--black));
  border-color: var(--accent);
}

.unlock-btn--active {
  color: rgb(var(--black));
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.unlock-form {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.unlock-input {
  width: 120px;
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--overlay-border);
  border-radius: 8px;
  background: var(--overlay-card);
  color: rgb(var(--black));
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.unlock-input:focus {
  border-color: var(--accent);
}

.unlock-input.has-error {
  border-color: #e55;
  animation: unlock-shake 0.35s ease;
}

@keyframes unlock-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}

.unlock-submit,
.unlock-cancel {
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--overlay-border);
  background: var(--overlay-card);
  color: rgb(var(--black));
  transition: border-color 0.15s;
}

.unlock-submit:hover:not(:disabled),
.unlock-cancel:hover {
  border-color: var(--accent);
}

.unlock-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.unlock-error {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: #e55;
  white-space: nowrap;
}
</style>
