// 初始化 GUN
const gun = Gun({
    peers: ['https://gun-manhattan.herokuapp.com/gun'] // 使用公共中繼服務器
});

// 示範如何使用 GUN.js 存儲和讀取數據
const data = gun.get('myApp');

// 添加資料示例
function addData(key, value) {
    data.get(key).put(value);
}

// 讀取資料示例
function getData(key) {
    data.get(key).on((data) => {
        console.log('接收到的數據:', data);
        document.getElementById('content').innerHTML = `
            <p>數據: ${JSON.stringify(data)}</p>
        `;
    });
}

// 示範用法
addData('message', '歡迎使用 GUN.js！');
getData('message');

// 康熙來了來賓資料庫
const celebrities = [
    {
        name: "蔡康永",
        hints: [
            "是固定主持人之一",
            "戴眼鏡",
            "說話很幽默",
            "曾出版很多書",
            "和小S搭檔多年"
        ]
    },
    {
        name: "小S",
        hints: [
            "是固定主持人之一",
            "本名徐熙娣",
            "有三個女兒",
            "說話很大膽",
            "常常把來賓懟的說不出話"
        ]
    },
    {
        name: "陳漢典",
        hints: [
            "常常模仿別人",
            "曾是星光幫成員",
            "很會跳舞",
            "長得帥",
            "常被虧是娘娘腔"
        ]
    }
    // 可以繼續添加更多藝人
];

let currentCelebrity = null;
let usedHints = [];
let score = 0;
let hintsLeft = 3;

// 遊戲狀態
const gameState = {
    isPlaying: false,
    currentIndex: -1
};

// 開始新遊戲
function startNewGame() {
    gameState.isPlaying = true;
    gameState.currentIndex = Math.floor(Math.random() * celebrities.length);
    currentCelebrity = celebrities[gameState.currentIndex];
    usedHints = [];
    hintsLeft = 3;
    updateUI();
}

// 顯示提示
function showNextHint() {
    if (hintsLeft > 0 && usedHints.length < currentCelebrity.hints.length) {
        const unusedHints = currentCelebrity.hints.filter(hint => !usedHints.includes(hint));
        const randomHint = unusedHints[Math.floor(Math.random() * unusedHints.length)];
        usedHints.push(randomHint);
        hintsLeft--;
        updateUI();
    }
}

// 檢查猜測
function checkGuess(guess) {
    if (!gameState.isPlaying) return;

    const isCorrect = guess.trim().toLowerCase() === currentCelebrity.name.toLowerCase();
    const resultElement = document.getElementById('result');
    
    if (isCorrect) {
        score += (hintsLeft + 1) * 10; // 根據剩餘提示數給分
        resultElement.textContent = `恭喜答對了！這位來賓就是${currentCelebrity.name}`;
        resultElement.className = 'correct';
        gameState.isPlaying = false;
    } else {
        resultElement.textContent = '猜錯了，再試試看！';
        resultElement.className = 'wrong';
    }
    
    updateUI();
}

// 更新UI
function updateUI() {
    const hintList = document.getElementById('hint-list');
    const scoreElement = document.getElementById('score');
    const hintsLeftElement = document.getElementById('hints-left');

    // 更新提示列表
    hintList.innerHTML = usedHints.map(hint => `<li>${hint}</li>`).join('');
    
    // 更新分數和剩餘提示數
    scoreElement.textContent = score;
    hintsLeftElement.textContent = hintsLeft;
}

// 綁定事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('player-guess');
    const submitButton = document.getElementById('submit-guess');
    const nextHintButton = document.getElementById('next-hint');
    const newGameButton = document.getElementById('new-game');

    submitButton.addEventListener('click', () => {
        checkGuess(guessInput.value);
        guessInput.value = '';
    });

    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkGuess(guessInput.value);
            guessInput.value = '';
        }
    });

    nextHintButton.addEventListener('click', showNextHint);
    newGameButton.addEventListener('click', startNewGame);

    // 自動開始第一局遊戲
    startNewGame();
});