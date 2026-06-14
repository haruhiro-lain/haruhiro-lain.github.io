import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'focus-mode'
const UNLOCK_KEY = 'focus-unlocked'
const INTERVIEW_UNLOCK_KEY = 'interview-unlocked'
const TODO_UNLOCK_KEY = 'todo-unlocked'
const UNLOCK_PASSWORD = '123123'

type FocusMode = 'on' | 'off'

const focusMode = ref<FocusMode>('on')
const focusUnlocked = ref(false)
const interviewUnlocked = ref(false)
const todoUnlocked = ref(false)

function syncFromDOM() {
  if (typeof document === 'undefined') return
  const attr = document.documentElement.getAttribute('data-focus-mode')
  if (attr === 'on' || attr === 'off') {
    focusMode.value = attr
  }
}

function syncUnlocked() {
  if (typeof localStorage === 'undefined') return
  focusUnlocked.value = localStorage.getItem(UNLOCK_KEY) === 'true'
}

function syncInterviewUnlocked() {
  if (typeof localStorage === 'undefined') return
  interviewUnlocked.value = localStorage.getItem(INTERVIEW_UNLOCK_KEY) === 'true'
}

function syncTodoUnlocked() {
  if (typeof localStorage === 'undefined') return
  todoUnlocked.value = localStorage.getItem(TODO_UNLOCK_KEY) === 'true'
}

function applyFocusMode(mode: FocusMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-focus-mode', mode)
  }
}

watch(focusMode, (mode) => {
  applyFocusMode(mode)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode)
  }
})

export function useFocusMode() {
  onMounted(() => {
    syncFromDOM()
    syncUnlocked()
    syncInterviewUnlocked()
    syncTodoUnlocked()
  })

  const toggleFocusMode = () => {
    if (!focusUnlocked.value) return
    focusMode.value = focusMode.value === 'on' ? 'off' : 'on'
  }

  const tryUnlockFocus = (password: string): boolean => {
    if (password === UNLOCK_PASSWORD) {
      focusUnlocked.value = true
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(UNLOCK_KEY, 'true')
      }
      return true
    }
    return false
  }

  const lockFocus = () => {
    focusUnlocked.value = false
    focusMode.value = 'on'
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(UNLOCK_KEY)
      localStorage.setItem(STORAGE_KEY, 'on')
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-focus-mode', 'on')
    }
  }

  const tryUnlockInterview = (password: string): boolean => {
    if (password === UNLOCK_PASSWORD) {
      interviewUnlocked.value = true
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(INTERVIEW_UNLOCK_KEY, 'true')
      }
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-interview-mode', 'on')
      }
      return true
    }
    return false
  }

  const lockInterview = () => {
    interviewUnlocked.value = false
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(INTERVIEW_UNLOCK_KEY)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-interview-mode', 'off')
    }
  }

  const tryUnlockTodo = (password: string): boolean => {
    if (password === UNLOCK_PASSWORD) {
      todoUnlocked.value = true
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(TODO_UNLOCK_KEY, 'true')
      }
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-todo-mode', 'on')
      }
      return true
    }
    return false
  }

  const lockTodo = () => {
    todoUnlocked.value = false
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TODO_UNLOCK_KEY)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-todo-mode', 'off')
    }
  }

  return {
    focusMode,
    focusUnlocked,
    interviewUnlocked,
    todoUnlocked,
    toggleFocusMode,
    tryUnlockFocus,
    lockFocus,
    tryUnlockInterview,
    lockInterview,
    tryUnlockTodo,
    lockTodo,
  }
}
