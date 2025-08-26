<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Выбор участника</h3>
          <button class="modal-close" @click="close">×</button>
        </div>
        
        <div class="modal-body">
          <p>Выберите участника или оставьте пустым для случайного выбора</p>
          <select 
            v-model="selectedParticipantId" 
            class="input participant-select"
            ref="participantSelect"
          >
            <option value="">Случайный выбор</option>
            <option 
              v-for="participant in participants" 
              :key="participant.id" 
              :value="participant.id"
            >
              {{ participant.name }}
            </option>
          </select>
        </div>
        
        <div class="modal-footer">
          <button class="btn ghost" @click="close">Отмена</button>
          <button class="btn" @click="confirm">OK</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  modelValue?: boolean
  participants: Array<{ id: string; name: string }>
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', participantId: string): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue || false)
const selectedParticipantId = ref('')
const participantSelect = ref<HTMLSelectElement | null>(null)

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal || false
  if (newVal) {
    nextTick(() => {
      participantSelect.value?.focus()
    })
  }
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
  if (newVal) {
    selectedParticipantId.value = ''
  }
})

function close() {
  isOpen.value = false
  emit('close')
}

function confirm() {
  emit('confirm', selectedParticipantId.value)
  close()
}

function handleOverlayClick() {
  close()
}

defineExpose({
  open: () => { isOpen.value = true },
  close
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
  min-width: 400px;
  max-width: 500px;
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

.participant-select {
  margin-top: 12px;
  font-size: 16px;
}

.modal-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
