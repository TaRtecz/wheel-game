<template>
  <div class="app">
    <!-- Переключатель этапов -->
    <StageSwitcher 
      v-model:currentStage="currentStage"
    />

    <!-- Этап настройки -->
    <section v-if="currentStage === 'setup'" class="setup-section">
      <div class="setup-section-content">
        <ParticipantManager />
        <ThemeManager />
      </div>
    </section>

    <!-- Этап игры -->
    <section v-if="currentStage === 'game'" class="card game-section">
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

          <RoundModal v-if="currentPayload" :payload="currentPayload" @answered="onAnswered" @skipped="onSkipped" />

          <div class="history-section">
            <h3>История</h3>
            <div v-if="store.history.length === 0" class="muted">Пока нет истории</div>
            <div
              v-for="h in store.history"
              :key="h.questionId + h.participantId"
              class="item history-item"
            >
              <div>
                <div class="history-header">
                  {{ nameById(h.participantId) }} —
                  {{ themeById(h.themeId)?.title || '—' }}
                  <span class="muted" v-if="h.skipped">(пропущено)</span>
                </div>
                <div class="muted">Вопрос: {{ questionTextById(h.questionId) }}</div>
              </div>
              <div class="muted">
                {{ h.answeredAt ? new Date(h.answeredAt).toLocaleString() : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <!-- Footer -->
    <Footer>
      <div class="footer-buttons">
        <template v-if="currentStage === 'setup'">
          <n-button type="primary" size="large" @click="assign">Распределить темы и начать игру</n-button>
          <n-button type="default" size="large" @click="reset">Сброс</n-button>
        </template>
        <template v-if="currentStage === 'game'">
          <n-button type="primary" size="large" @click="startGame">Крутить</n-button>
          <n-button type="default" size="large" @click="pickManual">Выбрать вручную</n-button>
        </template>
      </div>
    </Footer>
  </div>

  <!-- Модальное окно -->
  <Modal 
    v-model="isModalOpen"
    :title="modalConfig.title"
    :message="modalConfig.message"
    :type="modalConfig.type"
    @confirm="handleConfirm"
    @close="handleClose"
  />

  <!-- Модал для ввода имени -->
  <NameInputModal 
    v-model="isNameInputOpen"
    :participants="store.participants"
    @confirm="onNameInputConfirm"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ParticipantManager from './components/ParticipantManager.vue'
  import ThemeManager from './components/ThemeManager.vue'
  import Wheel from './components/Wheel.vue'
  import RoundModal from './components/RoundModal.vue'
  import Modal from './components/Modal.vue'
  import NameInputModal from './components/NameInputModal.vue'
  import StageSwitcher from './components/StageSwitcher.vue'
  import Footer from './components/Footer.vue'
  import { useGameStore } from './stores/game'
  import { useModal } from './composables/useModal'

  const store = useGameStore()
  const wheelRef = ref<any>(null)
  const currentPayload = ref<any | null>(null)
  const currentStage = ref<'setup' | 'game'>('setup')
  const { isOpen: isModalOpen, modalConfig, showAlert, showConfirm, handleConfirm, handleClose } = useModal()
  const isNameInputOpen = ref(false)

  function assign() {
    // Сбрасываем статус всех участников
    store.participants.forEach(p => p.isAnswered = false)
    
    store.assignThemesRandom()
    
    // Автоматически переключаемся на этап игры после распределения тем
    if (store.participants.length > 0 && store.themes.length > 0) {
      currentStage.value = 'game'
    }
  }
  async function reset() {
    const confirmed = await showConfirm('Сбросить всё?', 'Подтверждение')
    if (confirmed) {
      store.participants = []
      store.themes = []
      store.history = []
    }
  }

  function startGame() {
    if (store.participants.length === 0) {
      showAlert('Нет участников', 'Ошибка')
      return
    }
    
    // Выбираем только тех участников, которые еще не отвечали
    const availableParticipants = store.participants.filter(p => !p.isAnswered)
    
    if (availableParticipants.length === 0) {
      showAlert('Все участники уже ответили на вопросы', 'Игра завершена')
      return
    }
    
    // Выбираем случайного участника из доступных
    const chosen = availableParticipants[Math.floor(Math.random() * availableParticipants.length)]
    
    if (!chosen.themeId) {
      showAlert('Участнику не назначена тема. Распределите темы.', 'Ошибка')
      return
    }
    
    wheelRef.value?.spinToTheme(chosen.themeId)
  }

  function onSpinFinished(payload: any) {
    console.log(payload)

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
    isNameInputOpen.value = true
  }

  function onNameInputConfirm(participantId: string) {
    if (!participantId) {
      startGame()
      return
    }
    
    const participant = store.participants.find(x => x.id === participantId)
    if (!participant) {
      showAlert('Участник не найден', 'Ошибка')
      return
    }
    
    if (participant.isAnswered) {
      showAlert('Этот участник уже ответил на вопрос', 'Ошибка')
      return
    }
    
    if (!participant.themeId) {
      showAlert('Участнику не назначена тема', 'Ошибка')
      return
    }
    
    wheelRef.value?.spinToTheme(participant.themeId)
  }

  function nameById(id: string) {
    return store.participants.find(p => p.id === id)?.name || '(удалён)'
  }
  function themeById(id: string | undefined) {
    return store.themes.find(t => t.id === id)
  }
  function questionTextById(qid: string) {
    for (const t of store.themes) {
      const q = t.questions.find(q => q.id === qid)
      if (q) return q.text
    }
    return '(вопрос)'
  }
</script>

<style scoped>
  .wheel-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: flex-start;
    height: 100%;
  }

  .wheel-wrapper {
    width: 100%;
  }

  .controls-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

  .button-row {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .button-row .n-button {
    min-width: 200px;
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
    margin-top: 18px;
    display: flex;
    justify-content: center;
    gap: 8px;
    font-size: 18px;
    max-width: 500px;
    margin: 0 auto;
  }

  .stage-btn {
    padding: 8px 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 14px;
  }

  .stage-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .stage-btn.active {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
  }

  .section-title {
    margin-top: 0;
    text-align: center;
  }

  .setup-section-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .footer-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>
