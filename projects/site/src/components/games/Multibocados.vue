
<script setup lang="ts">
import { ref } from "vue";

defineProps<{ level: string }>();

const start = () => {
  console.log('start!');
}

</script>

<template>
  <main class="flex flex-col items-center m-4">
  <h1 class="text-xl">Multibocados</h1>

    <button type="button" @click="start()">Start</button>

  </main>
</template>

<style scoped>
</style>
