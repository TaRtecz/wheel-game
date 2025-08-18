<template>
  <div>
    <h3>Темы</h3>
    <input v-model="title" placeholder="Название темы" class="input" />
    <div class="color-input-row">
      <input
        type="color"
        v-model="color"
        class="color-picker"
      />
      <button class="btn small" @click="add">Добавить тему</button>
    </div>
    <textarea
      v-model="questionsText"
      placeholder="Вопросы — каждая строка"
      class="input questions-textarea"
    ></textarea>

    <div class="list themes-list">
      <div v-if="store.themes.length === 0" class="muted">Тем пока нет</div>
      <div
        v-for="t in store.themes"
        :key="t.id"
        class="item theme-item"
      >
        <div class="theme-header">
          <div class="theme-info">
            <div
              class="theme-color-indicator"
              :style="{ background: t.color }"
            ></div>
            <div>
              <div class="theme-title">{{ t.title }}</div>
              <div class="muted">{{ t.questions.length }} вопросов</div>
            </div>
          </div>
          <div>
            <button class="btn ghost small" @click="remove(t.id)">
              Удалить
            </button>
          </div>
        </div>
        <div class="questions-preview">
          <div
            v-for="q in t.questions.slice(0, 3)"
            :key="q.id"
            class="question-text"
          >
            {{ q.isAnswered ? "✓ " : "• " }}{{ q.text }}
          </div>
          <div v-if="t.questions.length > 3" class="muted">
            еще {{ t.questions.length - 3 }}...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useGameStore } from "../stores/game"
const store = useGameStore()
const title = ref("")
const color = ref("#f78aff")
const questionsText = ref("")
function add() {
  if (!title.value.trim()) return
  store.addTheme(title.value.trim(), color.value, questionsText.value)
  title.value = ""
  questionsText.value = ""
  color.value = generateRandomColor()
}

function generateRandomColor() {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a24', '#2f3542', '#3742fa', '#ff6348',
    '#ffa502', '#ff6b6b', '#48dbfb', '#0abde3', '#ff9ff3'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function remove(id: string) {
  if (confirm("Удалить тему?"))
    store.themes = store.themes.filter((t) => t.id !== id)
}
</script>

<style scoped>
.color-input-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.color-picker {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: none;
  padding: 0;
}

.questions-textarea {
  height: 90px;
}

.themes-list {
  margin-top: 8px;
}

.theme-item {
  flex-direction: column;
  align-items: flex-start;
}

.theme-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.theme-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theme-color-indicator {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--muted);
}

.theme-title {
  font-weight: 700;
}

.questions-preview {
  margin-top: 8px;
  width: 100%;
}

.question-text {
  font-size: 13px;
}
</style>
