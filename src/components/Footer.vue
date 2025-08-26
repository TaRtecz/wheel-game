<template>
  <footer class="footer">
    <slot></slot>
  </footer>
</template>

<script setup lang="ts">
// Компонент Footer с возможностью передачи контента через слот
</script>

<style scoped>
.footer {
  background-color: var(--bg-island);
  padding: 24px;
  border-radius: 32px 32px 0 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
