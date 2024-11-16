<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const { level = 10 } = defineProps<{ level?: number }>();

const isStarted = ref(false);
const timeLeft = ref(0);
const score = ref(0);
const width = ref(0);
const height = ref(0);
const correctAnswer = computed(() => width.value * height.value);
const gridSquares = ref<string[]>([]);
const answer = ref(0);
const showInteractionHint = ref(false);
const showError = ref(false);
const gameFieldClasses = computed(() => {
  return [
    showInteractionHint.value ? "interaction-hint" : "",
    showError.value ? "error" : "",
  ].join(" ");
});
let countDownInterval: number;
let interactionTimeout: number;

function start() {
  isStarted.value = true;
  timeLeft.value = 60;
  gridSquares.value = [];

  clearInterval(countDownInterval);
  countDownInterval = setInterval(() => {
    timeLeft.value -= 1;
    if (timeLeft.value <= 0) {
      clearInterval(countDownInterval);
      clearTimeout(interactionTimeout);
    }
  }, 1000);
  nextProblem();
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
function nextProblem() {
  height.value = getRandomInt(height.value, 1, level);
  width.value = getRandomInt(width.value, 1, level);
  gridSquares.value = generateGrid(width.value, height.value, ["r", "g", "b"]);

  clearTimeout(interactionTimeout);
  showInteractionHint.value = false;
  interactionTimeout = setTimeout(() => {
    showInteractionHint.value = true;
  }, 10000);
}

// TODO: move this to a separate file
// TODO: add unit tests for this function
function generateGrid(
  width: number,
  height: number,
  options: string[],
): string[] {
  const grid = Array(width * height).fill("");
  let xFactor = Math.floor(width / options.length);
  if (width < 6) {
    xFactor = width;
  }
  let yFactor = Math.floor(height / options.length);
  if (height < 6) {
    yFactor = height;
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Make the cool pattern
      // TODO: describe in more detail what is going on here
      const index =
        (Math.floor(x / xFactor) + Math.floor(y / yFactor)) % options.length;
      grid[y * width + x] = options[index];
    }
  }
  return grid;
}

function handleKeyboardButton(value: number) {
  clearTimeout(interactionTimeout);
  showInteractionHint.value = false;
  answer.value = answer.value * 10 + value;
  if (answer.value.toString().length == correctAnswer.value.toString().length) {
    checkAnswer();
  } else {
    // If the user doesn't hit a button within 5 seconds, they must be confused
    // and think that the answer has less digits than it does. Show an error
    interactionTimeout = setTimeout(checkAnswer, 5000);
  }
}
function checkAnswer() {
  showError.value = false;
  const isCorrect = answer.value == correctAnswer.value;
  if (isCorrect) {
    score.value++;
    nextProblem();
  } else {
    showError.value = true;
    // TODO: display answer hint
  }
  answer.value = 0;
}
</script>

<template>
  <main>
    <div id="game-field-container">
      <div id="game-field" :class="gameFieldClasses">
        <template v-if="isStarted && timeLeft > 0">
          <div id="status-row">
            <div class="number-box">
              ⏱ {{ timeLeft.toString().padStart(2, "0") }}
            </div>
            <div class="number-box">
              🥑 {{ score.toString().padStart(2, "0") }}
            </div>
          </div>
          <div id="factors">
            <span>{{ width }} × {{ height }}</span>
          </div>
          <div
            id="grid"
            class="large-box"
            :style="{ gridTemplateColumns: 'repeat(' + width + ', 1fr)' }"
          >
            <div
              v-for="(square, index) in gridSquares"
              :key="index"
              :class="'sq ' + square"
            ></div>
          </div>
          <div id="answer">
            <span>{{ answer }}</span>
          </div>
          <div id="keyboard">
            <button
              v-for="value in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]"
              :key="value"
              @click="handleKeyboardButton(value)"
            >
              {{ value }}
            </button>
          </div>
        </template>
        <template v-else-if="!isStarted">
          <div class="large-box huge-text">×</div>
          <button type="button" @click="start()" autofocus>▶️</button>
        </template>
        <template v-else>
          <div class="large-box">🥑 {{ score }}</div>
          <button type="button" @click="start()" autofocus>🔄</button>
        </template>
      </div>
    </div>
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
  overflow: clip;
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
#game-field-container {
  min-width: 100%;
  max-width: 100%;
  min-height: 0%;
  max-height: 100%;
}
#game-field {
  flex-grow: 1;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
  justify-content: stretch;
  aspect-ratio: 9/16;
  padding: 16px;
  background: #333;
  border: 8px #222 solid;
  border-radius: 24px;
  container-type: size;
  transition: all 50ms;
  &.interaction-hint button {
    animation: outline-fade 2s infinite;
  }
  &.error {
    /* TODO: make this better for color blind */
    border-color: red;
    #answer {
      background-color: red;
    }
  }
}

@media screen and (orientation: portrait) {
  #game-field-container {
    min-width: 100%;
    min-height: 0%;
  }
  #game-field {
    margin: auto 0;
  }
}
@media screen and (orientation: landscape) {
  #game-field-container {
    min-height: 100%;
  }
  #game-field {
    margin: 0 auto;
  }
}

#status-row {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  container-type: size;
}

#factors {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  container-type: size;

  > span {
    font-size: 80cqh;
    line-height: 1;
  }
}

#grid {
  container-type: size;
  display: grid;
  gap: 4px;
  align-items: stretch;
  background: transparent;
}

#answer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #222;
  border-radius: 32px;
  container-type: size;

  > span {
    font-family: mono;
    font-size: 80cqh;
    line-height: 1;
  }
}
#keyboard {
  flex: 2;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(5, 1fr);

  container-type: size;

  > button {
    background: transparent;
    font-size: 20cqh;
    line-height: 1;
    outline: 1px solid transparent;
    &:active {
      background: #88888888;
    }
  }
}
.large-box {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #444;
  border-radius: 16px;
  font-size: 10vh;
  line-height: 1;

  &.huge-text {
    font-size: 60cqh;
  }
}
.large-box + button {
  background: transparent;
  outline: 5px solid transparent;
  animation: outline-fade 2s ease-in-out infinite;
  width: 40cqw;
  border-radius: 25%;
  aspect-ratio: 1;
  margin: 0 auto;
  font-size: 10cqh;
}
.number-box {
  padding: 4px 16px;
  font-size: 50cqh;
  font-family: mono;
  border-radius: 16px;
  background: #444;
  color: #aaa;
}

.sq {
  background: gray;
  border-radius: 8px;

  &.g {
    background: green;
  }

  &.b {
    background: blue;
    border-radius: 2px;
  }

  &.r {
    background: red;
    border-radius: 24px;
  }
}

@keyframes outline-fade {
  0%,
  100% {
    outline-color: transparent;
  }
  50% {
    outline-color: white;
  }
}
</style>
