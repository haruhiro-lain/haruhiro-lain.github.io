<template>
  <div class="unlock-section">
    <!-- 已解锁：显示锁定按钮 -->
    <button
      v-if="focusUnlocked"
      class="unlock-btn"
      type="button"
      aria-label="不看动态"
      @click="lockFocus"
    >
      🔓 不看动态
    </button>

    <!-- 未解锁折叠态 -->
    <button
      v-else-if="!expanded"
      class="unlock-btn"
      type="button"
      aria-label="看看动态"
      @click="open"
    >
      🔒 看看动态
    </button>

    <!-- 未解锁展开态：密码输入 -->
    <form v-else class="unlock-form" @submit.prevent="submit">
      <input
        ref="inputRef"
        v-model="password"
        class="unlock-input"
        :class="{ 'has-error': errorMsg }"
        type="password"
        placeholder="输入密码"
        aria-label="解锁密码"
        autocomplete="off"
      />
      <button class="unlock-submit" type="submit" :disabled="!password">确认</button>
      <button class="unlock-cancel" type="button" @click="cancel">取消</button>
      <p v-if="errorMsg" class="unlock-error">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useFocusMode } from '../composables/useFocusMode'

const { focusUnlocked, tryUnlockFocus, lockFocus } = useFocusMode()

const expanded = ref(false)
const password = ref('')
const errorMsg = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function open() {
  expanded.value = true
  errorMsg.value = ''
  password.value = ''
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function cancel() {
  expanded.value = false
  errorMsg.value = ''
  password.value = ''
}

function submit() {
  const ok = tryUnlockFocus(password.value)
  if (ok) {
    errorMsg.value = ''
    expanded.value = false
  } else {
    errorMsg.value = '密码错误'
    password.value = ''
    inputRef.value?.focus()
  }
}
</script>

<style scoped>
.unlock-section {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  padding-bottom: 1rem;
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

.unlock-form {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  justify-content: center;
}

.unlock-input {
  width: 140px;
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
  width: 100%;
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: #e55;
  text-align: center;
}
</style>
