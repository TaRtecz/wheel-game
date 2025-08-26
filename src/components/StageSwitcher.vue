<template>
  <div class="stage-switcher">
    <h1>{{ stageTitle }}</h1>
    <div class="stage-switcher-buttons">
      <n-button 
        tertiary
        round
        :type="currentStage === 'setup' ? 'primary' : 'default'"
        size="large"
        @click="$emit('update:currentStage', 'setup')"
      >
        Настройка игры
      </n-button>
      <n-button 
        tertiary
        round
        :type="currentStage === 'game' ? 'primary' : 'default'"
        size="large"
        @click="$emit('update:currentStage', 'game')"
      >
        Игра
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    currentStage: 'setup' | 'game'
  }

  const props = defineProps<Props>()
  defineEmits<{
    'update:currentStage': [stage: 'setup' | 'game']
  }>()

  const stageTitle = computed<string>(() => {
    return props.currentStage === 'setup' ? 'Настройка игры' : 'Игра'
  })
</script>

<style scoped>
.stage-switcher {
  display: flex;
  justify-content: space-between;
  align-self: center;
  margin-bottom: 24px;
  background-color: var(--bg-island);
  padding: 24px;
  border-radius: 0 0 32px 32px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.stage-switcher-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
