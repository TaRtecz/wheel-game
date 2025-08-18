<template>
  <div class="card">
    <h3>Раунд</h3>
    <div v-if="!payload" class="muted">Нажмите СПИН, чтобы начать</div>
    <div v-else>
      <div class="muted">
        Игрок: <b>{{ payload.participant.name }}</b>
      </div>
      <div style="margin-top: 12px; font-size: 18px; font-weight: 700">
        Вопрос: {{ payload.question?.text }}
      </div>
      <div style="margin-top: 12px; display: flex; gap: 8px">
        <button class="btn" @click="answered">Ответил</button>
        <button class="btn ghost" @click="skip">Пропустить</button>
      </div>
    </div>
  </div>
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
