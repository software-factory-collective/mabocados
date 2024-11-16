<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref } from "vue";

defineProps<{ level: string }>();

const isStarted = ref(false);
const timeLeft = ref(0);
const score = ref(0);
const width = ref(0);
const height = ref(0);
const correctAnswer = computed(() => width.value * height.value);
const gridSquares = ref<string[]>([]);
const answer = ref(0);
const showError = ref(false);
const interval = ref<number | undefined>(undefined);

function start() {
  isStarted.value = true;
  timeLeft.value = 600;
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
    xFactor = width.value;
  }
  let yFactor = Math.floor(height.value / options.length);
  if (height.value < 6) {
    yFactor = height.value;
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

function handleKeyboardButton(value: number) {
  answer.value = answer.value * 10 + value;
  if (answer.value.toString().length == correctAnswer.value.toString().length) {
    checkAnswer();
  }
  // TODO: set a 5 second timer, check answer if user doesn't input another value
  // so they don't get confused of why there is no submit button
}
function checkAnswer() {
  showError.value = false;
  const isCorrect = answer.value == correctAnswer.value;
  if (isCorrect) {
    score.value++;
    generateGrid();
  } else {
    showError.value = true;
  }
  answer.value = 0;
}
</script>

<template>
  <main>
    <div id="game-field-container">
      <div id="game-field" :class="showError ? 'error' : ''">
        <template v-if="isStarted && timeLeft > 0">
          <div id="status-row">
            <div class="number-box">
              {{ timeLeft.toString().padStart(2, "0") }}
            </div>
            <div class="number-box">
              {{ score.toString().padStart(2, "0") }}
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
        <button v-else-if="!isStarted" type="button" @click="start()" autofocus>
          Start
        </button>
        <template v-else>
          <div class="large-box">
            {{ score }}
          </div>
          <button type="button" @click="start()" autofocus>Restart</button>
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
  grid-template-columns: repeat(5, 1fr);

  container-type: size;

  > button {
    background: transparent;
    font-size: 20cqh;
    line-height: 1;
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
</style>
