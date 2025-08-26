<template>
  <div class="card">
    <h3>Участники</h3>
    <div class="input-row">
      <input v-model="name" placeholder="Имя" class="input" />
      <button class="btn small" @click="add">Добавить</button>
    </div>
    <div class="list participants-list">
      <div v-if="store.participants.length === 0" class="muted">
        Список пуст
      </div>
      <div v-for="p in store.participants" :key="p.id" class="item">
        <div class="participant-info">
          <div class="participant-avatar">
            {{ p.name.slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <div class="participant-name">{{ p.name }}</div>
            <div class="muted">
              {{
                p.themeId
                  ? store.themes.find((t) => t.id === p.themeId)?.title || "—"
                  : "не назначен"
              }}
            </div>
          </div>
        </div>
        <div>
          <button class="btn ghost small" @click="remove(p.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Модальное окно -->
  <Modal 
    v-model="isOpen"
    :title="modalConfig.title"
    :message="modalConfig.message"
    :type="modalConfig.type"
    @confirm="handleConfirm"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useGameStore } from "../stores/game"
import { useModal } from "../composables/useModal"
import Modal from "./Modal.vue"

const store = useGameStore()
const { isOpen, modalConfig, showConfirm, handleConfirm, handleClose } = useModal()
const name = ref("")

function add() {
  if (!name.value.trim()) return
  store.addParticipant(name.value.trim())
  name.value = ""
}

async function remove(id: string) {
  const confirmed = await showConfirm("Удалить участника?", "Подтверждение")
  if (confirmed) {
    store.removeParticipant(id)
  }
}
</script>

<style scoped>
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.participants-list {
  margin-top: 145px;
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.participant-avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #fff;
  color: #071427;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.participant-name {
  font-weight: 700;
}
</style>
