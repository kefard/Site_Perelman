
const quizData = [
  {
    question: "А когда с человеком может произойти дрожемент?",
    explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».",
    answers: [
      { text: "Когда он влюбляется", isCorrect: false },
      { text: "Когда он идет шопиться", isCorrect: false },
      { text: "Когда он слышит смешную шутку", isCorrect: false },
      { text: "Когда он боится, пугается", isCorrect: true }
    ]
  },
  {
    question: "Говорят, Антон заовнил всех. Это еще как понимать?",
    explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить».",
    answers: [
      { text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", isCorrect: false },
      { text: "Антон очень надоедливый и въедливый человек, всех задолбал", isCorrect: false },
      { text: "Молодец, Антон, всех победил!", isCorrect: true },
      { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", isCorrect: false }
    ]
  },
  {
    question: "А фразу «заскамить мамонта» как понимать?",
    explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца.",
    answers: [
      { text: "Разозлить кого-то из родителей", isCorrect: false },
      { text: "Увлекаться археологией", isCorrect: false },
      { text: "Развести недотепу на деньги", isCorrect: true },
      { text: "Оскорбить пожилого человека", isCorrect: false }
    ]
  },
  {
    question: "Кто такие бефефе?",
    explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever.",
    answers: [
      { text: "Вши?", isCorrect: false },
      { text: "Милые котики, такие милые, что бефефе", isCorrect: false },
      { text: "Лучшие друзья", isCorrect: true },
      { text: "Люди, которые не держат слово", isCorrect: false }
    ]
  },
  {
    question: "Что из перечисленного можно назвать крашем, если ты чиллишь в компании и вдруг залипаешь на кого-то?",
    explanation: "«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться.",
    answers: [
      { text: "Человек, который тебе очень нравится и вызывает симпатию.", isCorrect: true },
      { text: "Твоя сильно накрашенная подруга, которая переоценила свой макияж.", isCorrect: false },
      { text: "Трэш в более мягкой интерпретации.", isCorrect: false }
    ]
  }
];


function shuffleArray(array) {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}


let randomizedQuestions = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isAnswerLocked = false;
let currentQuestionCard = null;

// DOM элементы
const questionsList = document.getElementById("questions-list");
const answersArea = document.getElementById("answers-area");
const statusTitle = document.getElementById("status-title");
const resultBox = document.getElementById("result-box");

function initQuiz() {
  randomizedQuestions = shuffleArray(quizData).map((q) => ({
    ...q,
    answers: shuffleArray(q.answers)
  }));
  currentQuestionIndex = 0;
  correctAnswersCount = 0;
  isAnswerLocked = false;
  renderNextQuestion();
}


function renderNextQuestion() {
  answersArea.innerHTML = "";
  isAnswerLocked = false;

  if (currentQuestionIndex >= randomizedQuestions.length) {
    finishQuiz();
    return;
  }

  const currentData = randomizedQuestions[currentQuestionIndex];

  currentQuestionCard = document.createElement("div");
  currentQuestionCard.className = "question-card";
  currentQuestionCard.dataset.index = currentQuestionIndex;

  const titleSpan = document.createElement("span");
  titleSpan.className = "question-text";
  titleSpan.textContent = `${currentQuestionIndex + 1}. ${currentData.question}`;
  currentQuestionCard.appendChild(titleSpan);

  questionsList.appendChild(currentQuestionCard);

  // Отрисовываем горизонтальный ряд вариантов ответа
  currentData.answers.forEach((ansObj, index) => {
    const card = document.createElement("div");
    card.className = "answer-card";
    card.textContent = ansObj.text;
    card.dataset.index = index;

    card.addEventListener("click", () => handleAnswerSelect(card, ansObj, currentData));
    answersArea.appendChild(card);
  });
}

// Обработка клика по варианту ответа
function handleAnswerSelect(selectedCard, answerObj, currentData) {
  if (isAnswerLocked) return;
  isAnswerLocked = true; // Блокировка повторных кликов

  selectedCard.classList.add("clicked");
  const answerCards = Array.from(answersArea.querySelectorAll(".answer-card"));
  answerCards.forEach((c) => c.classList.add("disabled"));

  const isCorrect = answerObj.isCorrect;
  if (isCorrect) correctAnswersCount++;

  if (isCorrect) {
    // 1. Увеличение и добавление пояснения
    selectedCard.classList.add("revealed-correct");
    const exp = document.createElement("div");
    exp.className = "explanation";
    exp.textContent = `Правильно! ${currentData.explanation}`;
    selectedCard.appendChild(exp);

    // 2. Через 2 секунды неправильные ответы поочередно улетают вправо
    setTimeout(() => {
      setMarker(isCorrect);

      const wrongCards = answerCards.filter((c) => c !== selectedCard);
      wrongCards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add("fly-right");
        }, idx * 180);
      });


      const wrongExitDuration = (wrongCards.length * 180) + 750;
      setTimeout(() => {
        selectedCard.classList.add("fly-right");
        setTimeout(() => {
          currentQuestionIndex++;
          renderNextQuestion();
        }, 650);
      }, wrongExitDuration);
    }, 2000);
  } else {
    setTimeout(() => {
      setMarker(isCorrect);

      answerCards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add("fly-right");
        }, idx * 180);
      });

      const totalExitDuration = (answerCards.length * 180) + 750;
      setTimeout(() => {
        currentQuestionIndex++;
        renderNextQuestion();
      }, totalExitDuration);
    }, 2000);
  }
}

function setMarker(isCorrect) {
  if (!currentQuestionCard) return;
  const marker = document.createElement("span");
  marker.className = `marker ${isCorrect ? "correct" : "wrong"}`;
  marker.textContent = isCorrect ? "✔" : "✖";
  currentQuestionCard.appendChild(marker);
}

function finishQuiz() {
  statusTitle.classList.remove("hidden");
  answersArea.innerHTML = "";

  resultBox.textContent = `Тестирование завершено! Правильных ответов: ${correctAnswersCount} из ${randomizedQuestions.length}.`;
  resultBox.classList.remove("hidden");

  enableQuestionReviewMode();
}

function enableQuestionReviewMode() {
  const cards = questionsList.querySelectorAll(".question-card");

  cards.forEach((card) => {
    card.classList.add("reviewable");
    card.title = "Нажмите, чтобы увидеть правильный ответ";

    card.addEventListener("click", () => {
      const qIndex = parseInt(card.dataset.index, 10);
      const qData = randomizedQuestions[qIndex];
      const correctAnswer = qData.answers.find((a) => a.isCorrect);

      answersArea.innerHTML = `
        <div class="review-modal-box">
          <h4>Правильный ответ на вопрос №${qIndex + 1}:</h4>
          <p><strong>${correctAnswer.text}</strong></p>
          <p class="explanation" style="margin-top: 0.5rem;">${qData.explanation}</p>
        </div>
      `;
    });
  });
}

document.addEventListener("DOMContentLoaded", initQuiz);