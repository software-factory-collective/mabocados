<script setup lang="ts">
import { ref } from "vue";

defineProps<{ level: string }>();

const isStarted = ref(false);
const timeLeft = ref(0);
const score = ref(0);
const columns = ref(5);
const rows = ref(5);
const gridSquares = ref<any[]>([]);
const answer = ref(null);

function start() {
  isStarted.value = true;
  timeLeft.value = 60;
  setInterval(() => {
    timeLeft.value -= 1;
  }, 1000);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGrid() {
  rows.value = getRandomInt(3, 9);
  columns.value = getRandomInt(3, 9);
  const totalSquares = rows.value * columns.value;
  gridSquares.value = Array(totalSquares).fill({
    color: "bg-[lightgray]",
  });
}

function checkAnswer() {
  // Add your answer checking logic here
}
</script>

<template>
  <h1 class="text-4xl">Multibocados</h1>
  <div class="text-xl">Level {{ level }}</div>
  <div v-if="isStarted">
    <div class="max-w-[640px] w-1/2 min-h-[50%] flex flex-col items-center">
      <div v-if="timeLeft > 0">
        <div class="w-full m-4 flex flex-row justify-between items-center">
          <div
            class="py-1 px-2 leading-none font-mono text-4xl rounded-xl bg-gray-800 text-gray-100"
          >
            {{ timeLeft.toString().padStart(2, "0") }}
          </div>
          <div
            class="m-4 py-1 px-2 text-4xl rounded-xl bg-green-900 text-gray-200"
          >
            {{ score.toString().padStart(2, "0") }}
          </div>
        </div>
        <div class="m-4 text-5xl">{{ columns }} × {{ rows }}</div>
        <div
          class="grid gap-2.5"
          :style="{ gridTemplateColumns: 'repeat(' + columns + ', 50px)' }"
        >
          <div
            v-for="(square, index) in gridSquares"
            :key="index"
            :class="'w-12 h-12 ' + square.color + ' rounded-md'"
          ></div>
        </div>
        <form @submit.prevent="checkAnswer" class="mb-4 mt-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="answer"
          >
            Answer
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="answer"
            type="number"
            v-model="answer"
            autofocus
          />
        </form>
      </div>
      <div v-else>The game has ended. Your final score is: {{ score }}</div>
    </div>
  </div>
  <button v-else type="button" @click="start()">Start</button>
</template>

<style scoped></style>
