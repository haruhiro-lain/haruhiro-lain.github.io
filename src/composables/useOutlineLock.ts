/**
 * 文章大纲侧边栏锁定状态
 *
 * FloatingActions.vue 触发切换，PostOutline.vue 读取状态。
 * 使用模块级 ref 实现跨组件共享，无需事件总线。
 */
import { ref } from 'vue'

/** 大纲侧边栏是否锁定展开 */
const outlineLocked = ref(false)

export function useOutlineLock() {
  /** 切换锁定状态 */
  function toggleLock() {
    outlineLocked.value = !outlineLocked.value
  }

  return {
    outlineLocked,
    toggleLock,
  }
}

