import { ref, computed } from "vue";

export function useMultibocadosGame(level = 10) {
  const isStarted = ref(false);
  const problemTotalSeconds = ref(10);
  const problemRemainingSeconds = ref(10);
  const score = ref(0);
  const width = ref(1);
  const height = ref(1);
  const answer = ref<number | null>(null);
  const showError = ref(false);
  const gridSquares = ref<string[]>([]);
  let countDownInterval: ReturnType<typeof setInterval>;

  const correctAnswer = computed(() => width.value * height.value);

  const gameFieldClasses = computed(() => {
    return [showError.value ? "error" : ""].join(" ");
  });

  function start() {
    isStarted.value = true;
    score.value = 0;
    width.value = 1;
    height.value = 1;
    gridSquares.value = [];
    showError.value = false;
    nextProblem();
  }

  function generateFactor(oldValue: number, min: number, max: number) {
    const options = [];
    for (let option = min; option <= max; option++) {
      options.push(option);
      if (option !== oldValue && option !== 0) {
        for (let i = 0; i < 9; i++) options.push(option);
      }
    }
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  function shuffle(array: any[]) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  function generateGrid(width: number, height: number, options: string[]) {
    const grid = Array(width * height).fill("");
    let xFactor = width < 6 ? width : Math.floor(width / options.length);
    let yFactor = height < 6 ? height : Math.floor(height / options.length);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index =
          (Math.floor(x / xFactor) + Math.floor(y / yFactor)) % options.length;
        grid[y * width + x] = options[index];
      }
    }
    return grid;
  }

  function nextProblem() {
    answer.value = null;
    height.value = generateFactor(height.value, 0, level);
    width.value = generateFactor(width.value, 0, level);
    const options = ["b", "g", "r"];
    shuffle(options);
    gridSquares.value = generateGrid(width.value, height.value, options);
    // The user will have 10 seconds for each of the first four problems,
    // 9 seconds for each of the next four problems,
    // 8 seconds for each of the next four problems, and so on,
    // until they have 1 second for each problem at score 36 and beyond.
    problemTotalSeconds.value = Math.max(10 - Math.floor(score.value / 4), 1);
    problemRemainingSeconds.value = problemTotalSeconds.value;
    startProblemTimer();
  }

  function startProblemTimer() {
    clearInterval(countDownInterval);
    countDownInterval = setInterval(() => {
      problemRemainingSeconds.value -= 0.01;
      if (problemRemainingSeconds.value <= 0) {
        showError.value = true;
        clearInterval(countDownInterval);
      }
    }, 10);
  }

  function handleKeyboardButton(value: number | string) {
    if (value === "⌫") {
      answer.value = Math.floor((answer.value ?? 0) / 10);
      // After clearing the last digit we should show no digits, not 0
      if (answer.value == 0) {
        answer.value = null;
      }
      return;
    }
    if (value === "↩") {
      checkAnswer();
      return;
    }

    answer.value = (answer.value ?? 0) * 10 + (value as number);
    // Auto-submit if the user has the correct answer.
    if (answer.value == correctAnswer.value) {
      checkAnswer();
    }
  }

  function checkAnswer() {
    showError.value = false;
    if (answer.value == correctAnswer.value) {
      score.value++;
      nextProblem();
    } else {
      showError.value = true;
      clearInterval(countDownInterval);
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Backspace") {
      // We don't want the browser to leave the game on this event.
      event.preventDefault();
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    if (isStarted.value && !showError.value) {
      if ("0123456789".includes(event.key)) {
        handleKeyboardButton(+event.key);
      } else if (event.key === "Backspace") {
        handleKeyboardButton("⌫");
      } else if (event.key === "Enter") {
        handleKeyboardButton("↩");
      }
    }
  }

  return {
    isStarted,
    problemTotalSeconds,
    problemRemainingSeconds,
    score,
    width,
    height,
    answer,
    showError,
    gridSquares,
    gameFieldClasses,
    start,
    handleKeyboardButton,
    onKeyDown,
    onKeyUp,
  };
}
