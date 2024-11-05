
<script setup lang="ts">
import { ref } from "vue";

defineProps<{ level: string }>();

const start = () => {
  console.log('start!');
}

</script>

<template>
  <main class="flex flex-col items-center gap-4 m-4">
  <h1 class="text-4xl">Multibocados</h1>
  <div class="text-xl">Level {{level}}</div>
    <button type="button" @click="start()">Start</button>

  </main>
</template>

<style scoped>
</style>
