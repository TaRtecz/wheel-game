<template>
  <Teleport to="body">
    <div class="round-modal">
      <div class="modal-card">
        <h3 class="modal-round-title">Отвечает <span class="participant-name">{{ payload?.participant.name }}</span></h3>
        <div v-if="!payload" class="muted">Нажмите СПИН, чтобы начать</div>
        <div v-else>
          <div class="question-text">
            Вопрос: <span class="question-text-value">{{ payload.question?.text }}</span>
          </div>
          <div class="button-group">
            <button class="btn" @click="answered">Ответил</button>
            <button class="btn ghost" @click="skip">Пропустить</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue"
import type { Participant, Question, Theme } from "../types"

const props = defineProps<{
  payload: { participant: Participant; question: Question; theme: Theme } | null
}>()
const emit = defineEmits(["answered", "skipped"])

function answered() {
  if (!props.payload) return
  emit("answered", {
    participantId: props.payload.participant?.id,
    themeId: props.payload.theme?.id,
    questionId: props.payload.question?.id,
  })
}
function skip() {
  if (!props.payload) return
  emit("skipped", {
    participantId: props.payload.participant?.id,
    themeId: props.payload.theme?.id,
    questionId: props.payload.question?.id,
  })
}
</script>

<style scoped>
.round-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 500px;
  background-color: var(--bg-island);
  padding: 24px;
  border-radius: 32px;
}

.modal-round-title {
  margin-top: 0;
  color: #8e8e8e;
}

.participant-name {
  color: #fff;
}

.question-text {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #8e8e8e;
}

.question-text-value {
  color: #fff;
}

.button-group {
  margin-top: 22px;
  display: flex;
  gap: 8px;
}
</style>
