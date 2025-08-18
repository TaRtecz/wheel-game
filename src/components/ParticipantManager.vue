<template>
  <div>
    <h3>Участники</h3>
    <div style="display: flex; gap: 8px; margin-bottom: 8px">
      <input v-model="name" placeholder="Имя" class="input" />
      <button class="btn small" @click="add">Добавить</button>
    </div>
    <div class="list">
      <div v-if="store.participants.length === 0" class="muted">
        Список пуст
      </div>
      <div v-for="p in store.participants" :key="p.id" class="item">
        <div style="display: flex; align-items: center; gap: 10px">
          <div style="
              width: 34px;
              height: 34px;
              border-radius: 8px;
              background: #fff;
              color: #071427;
              display: grid;
              place-items: center;
              font-weight: 700;
            ">
            {{ p.name.slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <div style="font-weight: 700">{{ p.name }}</div>
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
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useGameStore } from "../stores/game"
const store = useGameStore()
const name = ref("")
function add() {
  if (!name.value.trim()) return
  store.addParticipant(name.value.trim())
  name.value = ""
}
function remove(id: string) {
  if (confirm("Удалить участника?")) store.removeParticipant(id)
}
</script>
