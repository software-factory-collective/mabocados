<script setup lang="ts">
import { ref } from "vue";

defineProps<{ level: string }>();

const isStarted = ref(false);
const timeLeft = ref(0);
const score = ref(0);
const width = ref(0);
const height = ref(0);
const gridSquares = ref<string[]>([]);
const answer = ref(null);
const showError = ref(false);
const interval = ref<number | undefined>(undefined);

function start() {
  isStarted.value = true;
  timeLeft.value = 60;
  gridSquares.value = [];

  // TODO: is there a better way to handle the timer in vue??
  clearInterval(interval.value);
  interval.value = setInterval(() => {
    timeLeft.value -= 1;
  }, 1000);
  generateGrid();
}

function getRandomInt(oldValue: number, min: number, max: number) {
  let newValue = oldValue;
  while (newValue == oldValue) {
    newValue = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return newValue;
}

// TODO: put the grid pattern logic into a unit-testable function
// TODO: improve the algorithm to make the patterns as helpful as possible
function generateGrid() {
  height.value = getRandomInt(height.value, 3, 9);
  width.value = getRandomInt(width.value, 3, 9);
  const totalSquares = height.value * width.value;
  gridSquares.value = Array(totalSquares).fill("");

  const options = ["r", "g", "b"];
  let xFactor = Math.floor(width.value / options.length);
  if (width.value < 6) {
    xFactor = options.length;
  }
  let yFactor = Math.floor(height.value / options.length);
  if (height.value < 6) {
    yFactor = options.length;
  }

  for (let x = 0; x < width.value; x++) {
    for (let y = 0; y < height.value; y++) {
      // Make the cool pattern
      // TODO: describe in more detail what is going on here
      const index =
        (Math.floor(x / xFactor) + Math.floor(y / yFactor)) % options.length;
      gridSquares.value[y * width.value + x] = options[index];
    }
  }
  console.log(Array.from(gridSquares.value));
}

function checkAnswer() {
  showError.value = false;
  const isCorrect = answer.value == width.value * height.value;
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
        class="game-field flex flex-col items-center"
        :class="showError ? 'error' : ''"
      >
        <template v-if="timeLeft > 0">
          <div class="w-full m-4 flex flex-row justify-between items-center">
            <div class="number-box">
              {{ timeLeft.toString().padStart(2, "0") }}
            </div>
            <div class="number-box">
              {{ score.toString().padStart(2, "0") }}
            </div>
          </div>
          <div class="m-4 text-5xl">{{ width }} × {{ height }}</div>
          <div
            class="grid gap-2"
            :style="{ gridTemplateColumns: 'repeat(' + width + ', 1fr)' }"
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
        <template v-else>
          <div class="number-box">
            {{ score }}
          </div>
          <button type="button" @click="start()" autofocus>Restart</button>
        </template>
      </div>
    </template>
    <button v-else type="button" @click="start()" autofocus>Start</button>
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50vw;
  min-height: 50vh;
  padding: 16px;
  background: #333;
  border-radius: 24px;
  transition: all 50ms;

  &.error {
    border: 8px red solid;
  }
}

.number-box {
  margin: 16px;
  padding: 4px 16px;
  font-size: 2rem;
  font-family: mono;
  border-radius: 16px;
  background: #444;
  color: #aaa;
}

.sq {
  width: 3vw;
  height: 3vw;
  background: gray;
  border-radius: 8px;

  &.g {
    background: green;

    /* animation: shrink 0.77s linear infinite;*/
  }

  &.b {
    background: blue;
    border-radius: 2px;

    /* animation: jiggle 0.4s ease-in-out infinite;*/
  }

  &.r {
    background: red;
    border-radius: 24px;

    /* animation: bounce 0.34s ease-in-out infinite;*/
  }
}
@keyframes jiggle {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0);
  }
}
@keyframes bounce {
  0% {
    transform: translate(0);
  }
  50% {
    transform: translate(0, -3px);
  }
  100% {
    transform: translate(0);
  }
}
@keyframes shrink {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>
