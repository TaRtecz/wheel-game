import { ref } from 'vue'

interface ModalOptions {
  title?: string
  message?: string
  type?: 'alert' | 'confirm'
  persistent?: boolean
}

export function useModal() {
  const isOpen = ref(false)
  const modalConfig = ref<ModalOptions>({})
  const resolvePromise = ref<((value: boolean) => void) | null>(null)

  function showAlert(message: string, title?: string) {
    modalConfig.value = { message, title, type: 'alert' }
    isOpen.value = true
  }

  function showConfirm(message: string, title?: string): Promise<boolean> {
    return new Promise((resolve) => {
      resolvePromise.value = resolve
      modalConfig.value = { message, title, type: 'confirm' }
      isOpen.value = true
    })
  }

  function handleConfirm() {
    if (resolvePromise.value) {
      resolvePromise.value(true)
      resolvePromise.value = null
    }
    isOpen.value = false
  }

  function handleClose() {
    if (resolvePromise.value) {
      resolvePromise.value(false)
      resolvePromise.value = null
    }
    isOpen.value = false
  }

  function close() {
    handleClose()
  }

  return {
    isOpen,
    modalConfig,
    showAlert,
    showConfirm,
    handleConfirm,
    handleClose,
    close
  }
}
