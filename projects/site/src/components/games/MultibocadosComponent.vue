<script setup lang="ts">
import { ref } from "vue";

defineProps<{ level: string }>();

const isStarted = ref(false);
const timeLeft = ref(0);
const score = ref(0);
const columns = ref(0);
const rows = ref(0);
const gridSquares = ref<string[]>([]);
const answer = ref(null);
const showError = ref(false);

function start() {
  isStarted.value = true;
  timeLeft.value = 60;
  setInterval(() => {
    timeLeft.value -= 1;
  }, 1000);
  generateGrid();
}

function getRandomInt(oldValue, min, max) {
  let newValue = oldValue;
  while (newValue == oldValue) {
    newValue = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return newValue;
}

function generateGrid() {
  rows.value = getRandomInt(rows.value, 3, 9);
  columns.value = getRandomInt(columns.value, 3, 9);
  const totalSquares = rows.value * columns.value;
  gridSquares.value = Array(totalSquares).fill("");

  const repeats = { g: 3, b: 5, r: 7 };

  for (let x = 0; x < columns.value; x++) {
    for (let y = 0; y < rows.value; y++) {
      for (const [key, modulo] of Object.entries(repeats)) {
        if ((x + 1) % modulo == 0 || (y + 1) % modulo == 0) {
          gridSquares.value[y * columns.value + x] = key;
        }
      }
    }
  }
  console.log(Array.from(gridSquares.value));
}

function checkAnswer() {
  showError.value = false;
  const isCorrect = answer.value == columns.value * rows.value;
  console.log("is correct:", isCorrect);
  if (isCorrect) {
    score.value++;
    generateGrid();
  } else {
    showError.value = true;
  }
  answer.value = null;
}
</script>

<template>
  <main>
    <h1 class="text-4xl">Multibocados</h1>
    <!-- <div class="text-xl">Level {{ level }}</div> -->
    <template v-if="isStarted">
      <div
        class="game-field max-w-[640px] w-1/2 min-h-[50%] flex flex-col items-center"
        :class="showError ? 'error' : ''"
      >
        <template v-if="timeLeft > 0">
          <div class="w-full m-4 flex flex-row justify-between items-center">
            <div
              class="m-4 py-1 px-2 leading-none font-mono text-4xl rounded-xl bg-gray-800 text-gray-100"
            >
              {{ timeLeft.toString().padStart(2, "0") }}
            </div>
            <div
              class="m-4 py-1 px-2 text-4xl rounded-xl bg-green-900 text-gray-200"
            >
              {{ score.toString().padStart(2, "0") }}
            </div>
          </div>
          <!-- <div class="m-4 text-5xl">{{ columns }} × {{ rows }}</div> -->
          <div
            class="grid gap-2.5"
            :style="{ gridTemplateColumns: 'repeat(' + columns + ', 50px)' }"
          >
            <div
              v-for="(square, index) in gridSquares"
              :key="index"
              :class="'sq ' + square"
            ></div>
          </div>
          <form
            @submit.prevent="checkAnswer"
            class="mb-4 mt-4"
            autocomplete="off"
          >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="answer"
              type="number"
              v-model="answer"
              autofocus
            />
          </form>
        </template>
        <div v-else>The game has ended. Your final score is: {{ score }}</div>
      </div>
    </template>
    <button v-else type="button" @click="start()">Start</button>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
button {
  background: gray;
  border-radius: 8px;
  padding: 4px 8px;
}
input {
  background: transparent;
  color: white;
  border: 1px white solid;
}

.game-field {
  padding: 16px;
  background: #333;
  border-radius: 24px;
  transition: all 50ms;

  &.error {
    border: 8px red solid;
  }
}
.sq {
  width: 48px;
  height: 48px;
  background: gray;
  border-radius: 8px;

  &.g {
    background: green;
  }

  &.b {
    background: blue;
    border-radius: 12px;
  }

  &.r {
    background: red;
    border-radius: 24px;
  }
}
</style>
