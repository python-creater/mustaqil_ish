// DOM elementlarini tanlab olish
const textInput = document.getElementById("text-input");
const charCountEl = document.getElementById("char-count");
const charNoSpaceCountEl = document.getElementById("char-no-space-count");
const wordCountEl = document.getElementById("word-count");
const sentenceCountEl = document.getElementById("sentence-count");
const topWordsListEl = document.getElementById("top-words-list");
const statusMessageEl = document.getElementById("status-message");
const clearBtn = document.getElementById("clear-btn");
const sampleBtn = document.getElementById("sample-btn");

const SAMPLE_TEXT =
  "Frontend dasturlash asoslari zamonaviy veb-ilovalarni yaratishda muhim o'rin tutadi. " +
  "HTML sahifaning asosiy tuzilmasini shakllantirsa, CSS unga chiroyli ko'rinish va moslashuvchan maket beradi. " +
  "JavaScript esa sahifani jonlantiradi! Dasturlash jarayonida toza kod yozish va har bir funksiyani alohida tekshirish yaxshi natija beradi.";

// Matndan so'zlar massivini ajratib olish (o'zbekcha o', g' apostroflarini hisobga olgan holda)
function extractWords(rawText) {
  const normalized = rawText
    .toLowerCase()
    .replace(/[ʻ’‘`]/g, "'");

  // Harf, raqam va so'z ichidagi apostroflarni ajratish
  const matches = normalized.match(/[a-zа-яё0-9]+(?:'[a-zа-яё0-9]+)*/gi);
  return matches ? matches : [];
}

// Jumlalar sonini hisoblash
function countSentences(rawText) {
  const trimmed = rawText.trim();
  if (trimmed === "") {
    return 0;
  }

  const parts = trimmed
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return parts.length;
}

// Eng ko'p uchragan 5 ta so'zni aniqlash
function getTopWords(wordsArray, limit = 5) {
  const frequencyMap = {};

  for (let i = 0; i < wordsArray.length; i++) {
    const word = wordsArray[i];
    if (frequencyMap[word]) {
      frequencyMap[word] += 1;
    } else {
      frequencyMap[word] = 1;
    }
  }

  // Obyektni massivga aylantirib, uchrash soni bo'yicha kamayish tartibida saralash
  const wordObjects = Object.keys(frequencyMap).map((key) => {
    return {
      word: key,
      count: frequencyMap[key]
    };
  });

  wordObjects.sort((a, b) => b.count - a.count);

  return wordObjects.slice(0, limit);
}

// Top so'zlar ro'yxatini DOM'da yangilash
function renderTopWords(topWords) {
  topWordsListEl.innerHTML = "";

  if (topWords.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-item";
    emptyLi.textContent = "Hozircha ma’lumot yo‘q";
    topWordsListEl.appendChild(emptyLi);
    return;
  }

  topWords.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "top-word-item";

    const leftSpan = document.createElement("span");
    const rankSpan = document.createElement("span");
    rankSpan.className = "word-rank";
    rankSpan.textContent = `${index + 1}.`;

    const wordText = document.createTextNode(` ${item.word}`);
    leftSpan.appendChild(rankSpan);
    leftSpan.appendChild(wordText);

    const badgeSpan = document.createElement("span");
    badgeSpan.className = "word-count-badge";
    badgeSpan.textContent = `${item.count} marta`;

    li.appendChild(leftSpan);
    li.appendChild(badgeSpan);
    topWordsListEl.appendChild(li);
  });
}

// Asosiy tahlil funksiyasi
function analyzeText() {
  const text = textInput.value;
  const trimmedText = text.trim();

  // Kiritilgan qiymatni tekshirish
  if (trimmedText === "") {
    charCountEl.textContent = "0";
    charNoSpaceCountEl.textContent = "0";
    wordCountEl.textContent = "0";
    sentenceCountEl.textContent = "0";
    renderTopWords([]);

    if (text.length > 0) {
      statusMessageEl.textContent = "Faqat bo‘sh joylar kiritildi. Tahlil uchun matn yozing.";
      statusMessageEl.classList.add("warning");
    } else {
      statusMessageEl.textContent = "Tahlil qilish uchun yuqoridagi maydonga matn kiriting.";
      statusMessageEl.classList.remove("warning");
    }
    return;
  }

  const totalChars = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;
  const words = extractWords(text);
  const sentences = countSentences(text);
  const topFiveWords = getTopWords(words, 5);

  // Statistika kartalarini yangilash
  charCountEl.textContent = totalChars;
  charNoSpaceCountEl.textContent = charsWithoutSpaces;
  wordCountEl.textContent = words.length;
  sentenceCountEl.textContent = sentences;

  renderTopWords(topFiveWords);

  statusMessageEl.textContent = `Matn muvaffaqiyatli tahlil qilindi: ${words.length} ta so‘z aniqlandi.`;
  statusMessageEl.classList.remove("warning");
}

// Hodisalarni ulash
textInput.addEventListener("input", analyzeText);

sampleBtn.addEventListener("click", () => {
  textInput.value = SAMPLE_TEXT;
  analyzeText();
  textInput.focus();
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  analyzeText();
  textInput.focus();
});