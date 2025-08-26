<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 v-if="title">{{ title }}</h3>
          <button class="modal-close" @click="close">×</button>
        </div>
        
        <div class="modal-body">
          <p v-if="message">{{ message }}</p>
          <slot></slot>
        </div>
        
        <div class="modal-footer">
          <slot name="footer">
            <button v-if="type === 'confirm'" class="btn ghost" @click="close">Отмена</button>
            <button v-if="type === 'confirm'" class="btn" @click="confirm">Подтвердить</button>
            <button v-else class="btn" @click="close">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: boolean
  title?: string
  message?: string
  type?: 'alert' | 'confirm'
  persistent?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'alert',
  persistent: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue || false)

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal || false
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

function close() {
  if (props.persistent) return
  isOpen.value = false
  emit('close')
}

function confirm() {
  emit('confirm')
  close()
}

function handleOverlayClick() {
  if (!props.persistent) {
    close()
  }
}

// Экспортируем методы для внешнего использования
defineExpose({
  open: () => { isOpen.value = true },
  close,
  confirm
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--surface);
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--white);
}

.modal-body {
  padding: 20px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
