<template>
  <div class="app">
    <div class="card">
      <div class="wheel-container">
        <div class="wheel-wrapper">
          <Wheel
            ref="wheelRef"
            :themes="store.themes"
            :participants="store.participants"
            @spin-finished="onSpinFinished"
          />
        </div>
        <div class="controls-section">
          <div class="button-row">
            <button class="btn btn-start" @click="startGame">Крутить</button>
            <button class="btn ghost btn-manual" @click="pickManual">
              Выбрать вручную
            </button>
          </div>

          <RoundModal
            :payload="currentPayload"
            @answered="onAnswered"
            @skipped="onSkipped"
          />

          <div class="history-section">
            <h3>История</h3>
            <div v-if="store.history.length === 0" class="muted">
              Пока нет истории
            </div>
            <div
              v-for="h in store.history"
              :key="h.questionId + h.participantId"
              class="item history-item"
            >
              <div>
                <div class="history-header">
                  {{ nameById(h.participantId) }} —
                  {{ themeById(h.themeId)?.title || "—" }}
                  <span class="muted" v-if="h.skipped">(пропущено)</span>
                </div>
                <div class="muted">
                  Вопрос: {{ questionTextById(h.questionId) }}
                </div>
              </div>
              <div class="muted">
                {{
                  h.answeredAt ? new Date(h.answeredAt).toLocaleString() : ""
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2>Управление</h2>
      <ParticipantManager />
      <hr class="divider" />
      <ThemeManager />
      <div class="management-buttons">
        <button class="btn" @click="assign">Распределить темы</button>
        <button class="btn ghost" @click="reset">Сброс</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import ParticipantManager from "./components/ParticipantManager.vue"
import ThemeManager from "./components/ThemeManager.vue"
import Wheel from "./components/Wheel.vue"
import RoundModal from "./components/RoundModal.vue"
import { useGameStore } from "./stores/game"

const store = useGameStore()
const wheelRef = ref<any>(null)
const currentPayload = ref<any | null>(null)

function assign() {
  store.assignThemesRandom()
  console.log(store.participants);
  console.log(store.themes);
  
}
function reset() {
  if (confirm("Сбросить всё?")) {
    store.participants = []
    store.themes = []
    store.history = []
  }
}

function startGame() {
  if (store.participants.length === 0) return alert("Нет участников")
  // choose random participant
  const chosen =
    store.participants[Math.floor(Math.random() * store.participants.length)]
  if (!chosen.themeId) {
    return alert("Участнику не назначена тема. Распределите темы.")
  }
  // request wheel to spin to theme
  console.log('test');
  console.log(chosen.themeId);
  
  wheelRef.value?.spinToTheme(chosen.themeId)
}

function onSpinFinished(payload: any) {
  console.log(payload);
  
  currentPayload.value = payload
}

function onAnswered({
  participantId,
  themeId,
  questionId,
}: {
  participantId: string
  themeId: string
  questionId: string
}) {
  store.markQuestionAnswered(themeId, questionId, participantId)
  currentPayload.value = null
}
function onSkipped({
  participantId,
  themeId,
  questionId,
}: {
  participantId: string
  themeId: string
  questionId: string
}) {
  store.skipQuestion(themeId, questionId, participantId)
  currentPayload.value = null
}

function pickManual() {
  const name = prompt("Имя участника (оставить пустым для случайного)")
  if (!name) {
    startGame()
    return
  }
  const p = store.participants.find(
    (x) => x.name.toLowerCase() === name.toLowerCase()
  )
  if (!p) return alert("Не найден")
  wheelRef.value?.spinToTheme(p.themeId)
}

function nameById(id: string) {
  return store.participants.find((p) => p.id === id)?.name || "(удалён)"
}
function themeById(id: string | undefined) {
  return store.themes.find((t) => t.id === id)
}
function questionTextById(qid: string) {
  for (const t of store.themes) {
    const q = t.questions.find((q) => q.id === qid)
    if (q) return q.text
  }
  return "(вопрос)"
}
</script>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  padding: 12px;
}

.wheel-wrapper {
  width: 520px;
  margin: 0 auto;
}

.controls-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.button-row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.btn-start {
  font-size: 22px;
}

.btn-manual {
  font-size: 11px;
}

.history-section {
  margin-top: 0;
}

.history-item {
  margin-top: 8px;
}

.history-header {
  font-weight: 700;
}

.divider {
  margin: 12px 0;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.management-buttons {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
</style>
