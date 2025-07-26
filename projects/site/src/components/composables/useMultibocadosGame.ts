import { ref, computed } from "vue";

export function useMultibocadosGame(level = 10) {
  const isStarted = ref(false);
  const timeLeft = ref(0);
  const score = ref(0);
  const width = ref(1);
  const height = ref(1);
  const answer = ref(0);
  const showInteractionHint = ref(false);
  const showError = ref(false);
  const gridSquares = ref<string[]>([]);
  let countDownInterval: number;
  let interactionTimeout: number;

  const isGameRunning = computed(() => isStarted.value && timeLeft.value > 0);
  const correctAnswer = computed(() => width.value * height.value);

  const gameFieldClasses = computed(() => {
    return [
      showInteractionHint.value ? "interaction-hint" : "",
      showError.value && isGameRunning.value ? "error" : "",
    ].join(" ");
  });

  function start() {
    isStarted.value = true;
    timeLeft.value = 60;
    score.value = 0;
    width.value = 1;
    height.value = 1;
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

  function generateFactor(oldValue: number, min: number, max: number) {
    const options = [];
    for (let option = min; option <= max; option++) {
      options.push(option);
      if (option != oldValue && option != 0) {
        for (let i = 0; i < 9; i++) options.push(option);
      }
    }
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  function shuffle(array: any[]) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
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
          (Math.floor(x / xFactor) + Math.floor(y / yFactor)) %
          options.length;
        grid[y * width + x] = options[index];
      }
    }
    return grid;
  }

  function nextProblem() {
    height.value = generateFactor(height.value, 0, level);
    width.value = generateFactor(width.value, 0, level);
    const options = ["b", "g", "r"];
    shuffle(options);
    gridSquares.value = generateGrid(width.value, height.value, options);

    clearTimeout(interactionTimeout);
    showInteractionHint.value = false;
    interactionTimeout = setTimeout(() => {
      showInteractionHint.value = true;
    }, 10000);
  }

  function handleKeyboardButton(value: number | string) {
    clearTimeout(interactionTimeout);
    showInteractionHint.value = false;

    if (value === "⌫") {
      answer.value = Math.floor(answer.value / 10);
      return;
    }
    if (value === "↩") {
      checkAnswer();
      return;
    }

    answer.value = answer.value * 10 + (value as number);

    if (
      answer.value.toString().length ===
      correctAnswer.value.toString().length
    ) {
      checkAnswer();
    } else {
      interactionTimeout = setTimeout(checkAnswer, 5000);
    }
  }

  function checkAnswer() {
    showError.value = false;
    if (answer.value == correctAnswer.value) {
      score.value++;
      nextProblem();
    } else {
      showError.value = true;
    }
    answer.value = 0;
  }

  function onKeyUp(event: KeyboardEvent) {
    if (isGameRunning.value) {
      if ("0123456789".includes(event.key)) {
        handleKeyboardButton(+event.key);
      } else if (event.key === "Backspace") {
        handleKeyboardButton("⌫");
      } else if (event.key === "Enter") {
        handleKeyboardButton("↩");
      }
    } else {
      const startKeys = [" ", "s", "Enter"];
      if (startKeys.includes(event.key)) start();
    }
  }

  return {
    isStarted,
    timeLeft,
    score,
    width,
    height,
    answer,
    showInteractionHint,
    showError,
    gridSquares,
    isGameRunning,
    gameFieldClasses,
    start,
    handleKeyboardButton,
    onKeyUp,
  };
}
