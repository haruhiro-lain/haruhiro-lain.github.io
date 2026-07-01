/**
 * 点击外部检测 composable
 *
 * 当用户在指定元素外部点击（pointerdown）时触发回调。
 * 常用于关闭下拉菜单、弹窗等场景。
 *
 * @param elRef    - 目标元素的模板引用
 * @param callback - 点击外部时执行的函数
 */
import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useClickOutside(
  elRef: Ref<HTMLElement | null | undefined>,
  callback: () => void,
) {
  /** 全局 pointerdown 事件处理器 */
  const handler = (event: PointerEvent) => {
    if (!elRef.value) return
    if (!(event.target instanceof Node)) return
    // 如果点击目标在元素内部，不触发回调
    if (elRef.value.contains(event.target)) return
    callback()
  }

  onMounted(() => {
    document.addEventListener('pointerdown', handler)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handler)
  })
}
