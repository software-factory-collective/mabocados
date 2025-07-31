<script setup lang="ts">
  import { useMultibocadosGame } from "../composables/useMultibocadosGame";
  const { level = 10 } = defineProps<{ level?: number }>();

  const { 
    isStarted, isGameRunning, gridSquares, width, height,
    timeLeft, score, answer, showError, gameFieldClasses,
    start, handleKeyboardButton, onKeyUp
  } = useMultibocadosGame(level);
</script>

<template>
  <main>
    <div id="game-field-container" tabindex="0" @keyup="onKeyUp">
      <div id="game-field" :class="gameFieldClasses">
        <template v-if="isGameRunning">
          <div id="status-row">
            <div class="number-box">
              ⏱ {{ timeLeft.toString().padStart(2, "0") }}
            </div>
            <div>
              <span id="factors">{{ width }} × {{ height }}</span>
            </div>
            <div class="number-box">
              🥑 {{ score.toString().padStart(2, "0") }}
            </div>
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
          <div id="keyboard" class="keyboard">
            <div class="keyboard-row">
              <button v-for="n in [0,1,2,3,4]" :key="n" @click="handleKeyboardButton(n)">{{ n }}</button>
            </div>
            <div class="keyboard-row">
              <button v-for="n in [5,6,7,8,9]" :key="n" @click="handleKeyboardButton(n)">{{ n }}</button>
            </div>
            <div class="keyboard-row">
              <button class="btn-backspace" @click="handleKeyboardButton('⌫')">⌫</button>
              <button class="btn-enter" @click="handleKeyboardButton('↩')">↩</button>
            </div>
          </div>
        </template>
        <template v-else-if="!isStarted">
          <div class="large-box">
            <span class="huge-text">×</span>
            <span class="level-number">{{ level }}</span>
          </div>
          <div>
            <button type="button" @click="start()" autofocus>▶️</button>
          </div>
        </template>
        <template v-else>
          <div class="large-box">🥑 {{ score }}</div>
          <div>
            <button type="button" @click="start()" autofocus>🔄</button>
          </div>
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
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 0%;
  max-height: 100%;
}

#game-field {
  flex-grow: 1;
  min-height: 0%;
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
  font-size: 80cqh;
  line-height: 1;
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

.keyboard {
  display: grid;
  gap: 8px;
}

.keyboard-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.keyboard-row:last-of-type {
  grid-template-columns: repeat(2, 1fr);
}

.keyboard button {
  background: #444;
  color: white;
  font-size: 2rem;
  padding: 0.5rem;
  border-radius: 8px;
}

.keyboard .btn-backspace {
  background: red;
  color: white;
}

.keyboard .btn-enter {
  background: green;
  color: white;
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

  & > .huge-text {
    font-size: 50cqh;
  }

  & > .level-number {
    font-size: 20cqh;
  }

  & + div {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    & > button {
      background: transparent;
      outline: 5px solid transparent;
      animation: outline-fade 2s ease-in-out infinite;
      width: 40cqw;
      border-radius: 25%;
      aspect-ratio: 1;
      margin: 0 auto;
      font-size: 10cqh;
    }
  }
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
