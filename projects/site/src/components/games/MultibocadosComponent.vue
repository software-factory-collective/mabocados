<script setup lang="ts">
import { useMultibocadosGame } from "../composables/useMultibocadosGame";
const { level = 10 } = defineProps<{ level?: number }>();

function goToNextLevel() {
  const nextLevel = level + 1;
  window.location.href = `/demo/multibocados/${nextLevel}`;
}

const {
  isStarted,
  gridSquares,
  width,
  height,
  problemTotalSeconds,
  problemRemainingSeconds,
  score,
  answer,
  isGameOver,
  gameFieldClasses,
  canAdvanceToNextLevel,
  start,
  handleKeyboardButton,
  onKeyDown,
  onKeyUp,
} = useMultibocadosGame(level);
</script>

<template>
  <main>
    <div
      id="game-field-container"
      tabindex="0"
      @keydown="onKeyDown"
      @keyup="onKeyUp"
    >
      <div id="game-field" :class="gameFieldClasses">
        <template v-if="isStarted">
          <div
            v-if="!isGameOver"
            id="timer-indicator"
            :style="{
              width: `${(problemRemainingSeconds / problemTotalSeconds) * 100}%`,
              backgroundColor: problemRemainingSeconds <= 2 ? 'red' : 'green',
            }"
          ></div>
          <div v-if="!isGameOver" id="status-row">
            <div>
              <span id="factors">{{ width }} × {{ height }}</span>
            </div>
            <div class="number-box">
              🥑 {{ score.toString().padStart(2, "0") }}
            </div>
          </div>
          <div
            v-if="!isGameOver"
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
          <div v-if="!isGameOver" id="answer-row">
            <div id="answer">
              <span>{{ answer ?? "" }}</span>
            </div>
          </div>
          <div v-if="!isGameOver" id="keyboard" class="keyboard">
            <div class="keyboard-row">
              <button
                v-for="n in [0, 1, 2, 3, 4]"
                :key="n"
                @click="handleKeyboardButton(n)"
              >
                {{ n }}
              </button>
            </div>
            <div class="keyboard-row">
              <button
                v-for="n in [5, 6, 7, 8, 9]"
                :key="n"
                @click="handleKeyboardButton(n)"
              >
                {{ n }}
              </button>
            </div>
            <div class="keyboard-row">
              <button class="btn-backspace" @click="handleKeyboardButton('⌫')">
                ⌫
              </button>
              <button class="btn-enter" @click="handleKeyboardButton('↩')">
                ↩
              </button>
            </div>
          </div>
          <div v-if="isGameOver" class="game-over-screen">
            <div class="score-display">
              <div class="score-value">🥑 {{ score.toString().padStart(2, "0") }}</div>
            </div>
            <div class="game-over-button-container">
              <button 
                type="button" 
                @click="canAdvanceToNextLevel ? goToNextLevel() : start()" 
                autofocus
                class="game-over-button"
              >
                {{ canAdvanceToNextLevel ? '➡️' : '🔄' }}
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="large-box">
            <span class="huge-text">×</span>
            <span class="level-number">{{ level }}</span>
          </div>
          <div class="large-button-container">
            <button type="button" @click="start()" autofocus>▶️</button>
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
  outline: none;
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
  aspect-ratio: 9/18;
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
      border-color: red;
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

#timer-indicator {
  height: 4px;
  border-radius: 4px;
  transition: width 0.01s linear;
}

#status-row {
  flex: 1;
  max-height: 6vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  container-type: size;
}

#factors {
  font-size: 100cqh;
  line-height: 1;
}

#grid {
  container-type: size;
  display: grid;
  gap: 4px;
  align-items: stretch;
  background: transparent;
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
  font-size: 1.5rem;
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

#answer-row {
  flex: 1;
  display: flex;

  > div {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: #222;
    border: transparent 4px solid;
    border-radius: 32px;
    container-type: size;
  }

  span {
    font-family: mono;
    font-size: 60cqh;
    line-height: 1;
  }
}

.game-over-screen {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  padding-top: 60px;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}



.score-value {
  font-size: 12cqh;
  font-family: mono;
  background: #444;
  padding: 16px 32px;
  border-radius: 16px;
  color: #aaa;
}

.game-over-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-over-button {
  background: #444;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 4cqh;
  outline: 3px solid transparent;
  animation: outline-fade 2s ease-in-out infinite;
  transition: all 0.2s ease;

  &:hover {
    background: #555;
    transform: scale(1.05);
  }
}

.large-button-container {
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
    font-size: 30cqh;
  }

  & > .level-number {
    font-size: 20cqh;
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
