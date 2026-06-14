<template>
  <div class="unlock-section">
    <!-- 动态按钮 -->
    <!-- 已解锁 -->
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
      v-else-if="unlockTarget !== 'life' || !lifeExpanded"
      class="unlock-btn"
      type="button"
      aria-label="看看动态"
      @click="open('life')"
    >
      🔒 看看动态
    </button>

    <!-- 面经按钮 -->
    <button
      v-if="interviewUnlocked"
      class="unlock-btn"
      type="button"
      aria-label="不看面经"
      @click="lockInterview"
    >
      🔓面经
    </button>
    <button
      v-else-if="unlockTarget !== 'interview' || !interviewExpanded"
      class="unlock-btn"
      type="button"
      aria-label="看看面经"
      @click="open('interview')"
    >
      🔒面经
    </button>

    <!-- 草稿按钮 -->
    <button
      v-if="todoUnlocked"
      class="unlock-btn"
      type="button"
      aria-label="不看TO-DO"
      @click="lockTodo"
    >
      🔓TO-DO
    </button>
    <button
      v-else-if="unlockTarget !== 'todo' || !todoExpanded"
      class="unlock-btn"
      type="button"
      aria-label="看看TO-DO"
      @click="open('todo')"
    >
      🔒TO-DO
    </button>

    <!-- 密码输入（动态） -->
    <form v-if="unlockTarget === 'life' && lifeExpanded" class="unlock-form" @submit.prevent="submitLife">
      <input
        ref="lifeInputRef"
        v-model="lifePassword"
        class="unlock-input"
        :class="{ 'has-error': lifeError }"
        type="password"
        placeholder="输入密码"
        aria-label="解锁动态密码"
        autocomplete="off"
      />
      <button class="unlock-submit" type="submit" :disabled="!lifePassword">确认</button>
      <button class="unlock-cancel" type="button" @click="cancelLife">取消</button>
      <p v-if="lifeError" class="unlock-error">{{ lifeError }}</p>
    </form>

    <!-- 密码输入（面经） -->
    <form v-if="unlockTarget === 'interview' && interviewExpanded" class="unlock-form" @submit.prevent="submitInterview">
      <input
        ref="interviewInputRef"
        v-model="interviewPassword"
        class="unlock-input"
        :class="{ 'has-error': interviewError }"
        type="password"
        placeholder="输入密码"
        aria-label="解锁面经密码"
        autocomplete="off"
      />
      <button class="unlock-submit" type="submit" :disabled="!interviewPassword">确认</button>
      <button class="unlock-cancel" type="button" @click="cancelInterview">取消</button>
      <p v-if="interviewError" class="unlock-error">{{ interviewError }}</p>
    </form>

    <!-- 密码输入（草稿） -->
    <form v-if="unlockTarget === 'todo' && todoExpanded" class="unlock-form" @submit.prevent="submitTodo">
      <input
        ref="todoInputRef"
        v-model="todoPassword"
        class="unlock-input"
        :class="{ 'has-error': todoError }"
        type="password"
        placeholder="输入密码"
        aria-label="解锁草稿密码"
        autocomplete="off"
      />
      <button class="unlock-submit" type="submit" :disabled="!todoPassword">确认</button>
      <button class="unlock-cancel" type="button" @click="cancelTodo">取消</button>
      <p v-if="todoError" class="unlock-error">{{ todoError }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useFocusMode } from '../composables/useFocusMode'

const { focusUnlocked, interviewUnlocked, todoUnlocked, tryUnlockFocus, lockFocus, tryUnlockInterview, lockInterview, toggleFocusMode, tryUnlockTodo, lockTodo } = useFocusMode()

type UnlockTarget = 'life' | 'interview' | 'todo'

const unlockTarget = ref<UnlockTarget | null>(null)
const lifeExpanded = ref(false)
const interviewExpanded = ref(false)
const todoExpanded = ref(false)
const lifePassword = ref('')
const interviewPassword = ref('')
const todoPassword = ref('')
const lifeError = ref('')
const interviewError = ref('')
const todoError = ref('')
const lifeInputRef = ref<HTMLInputElement | null>(null)
const interviewInputRef = ref<HTMLInputElement | null>(null)
const todoInputRef = ref<HTMLInputElement | null>(null)

function open(target: UnlockTarget) {
  unlockTarget.value = target
  if (target === 'life') {
    lifeExpanded.value = true
    lifeError.value = ''
    lifePassword.value = ''
    nextTick(() => lifeInputRef.value?.focus())
  } else if (target === 'interview') {
    interviewExpanded.value = true
    interviewError.value = ''
    interviewPassword.value = ''
    nextTick(() => interviewInputRef.value?.focus())
  } else {
    todoExpanded.value = true
    todoError.value = ''
    todoPassword.value = ''
    nextTick(() => todoInputRef.value?.focus())
  }
}

function cancelLife() {
  lifeExpanded.value = false
  lifeError.value = ''
  lifePassword.value = ''
  unlockTarget.value = null
}

function cancelInterview() {
  interviewExpanded.value = false
  interviewError.value = ''
  interviewPassword.value = ''
  unlockTarget.value = null
}

function cancelTodo() {
  todoExpanded.value = false
  todoError.value = ''
  todoPassword.value = ''
  unlockTarget.value = null
}

function submitLife() {
  const ok = tryUnlockFocus(lifePassword.value)
  if (ok) {
    lifeError.value = ''
    lifeExpanded.value = false
    unlockTarget.value = null
    toggleFocusMode()
  } else {
    lifeError.value = '密码错误'
    lifePassword.value = ''
    lifeInputRef.value?.focus()
  }
}

function submitInterview() {
  const ok = tryUnlockInterview(interviewPassword.value)
  if (ok) {
    interviewError.value = ''
    interviewExpanded.value = false
    unlockTarget.value = null
  } else {
    interviewError.value = '密码错误'
    interviewPassword.value = ''
    interviewInputRef.value?.focus()
  }
}

function submitTodo() {
  const ok = tryUnlockTodo(todoPassword.value)
  if (ok) {
    todoError.value = ''
    todoExpanded.value = false
    unlockTarget.value = null
    window.location.href = '/TO-DO'
  } else {
    todoError.value = '密码错误'
    todoPassword.value = ''
    todoInputRef.value?.focus()
  }
}
</script>

<style scoped>
.unlock-section {
  display: flex;
  justify-content: flex-start;
  gap: 0.6rem;
  margin-top: 2rem;
  padding-bottom: 1rem;
  flex-wrap: wrap;
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
