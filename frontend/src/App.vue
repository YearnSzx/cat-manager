<template>
  <Navbar />
  <main class="main-content">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<style>
#app {
  min-height: 100vh;
}

.main-content {
  min-height: calc(100vh - 60px);
}
</style>
