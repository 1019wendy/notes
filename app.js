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
    },
    {
        name: "黃子佼",
        hints: [
            "是資深主持人",
            "外號「佼佼」",
            "說話很溫柔",
            "曾主持過「天才衝衝衝」",
            "結婚前是演藝圈鑽石剩男"
        ]
    },
    {
        name: "吳宗憲",
        hints: [
            "外號「憲哥」",
            "是綜藝天王",
            "有一個女兒是網紅",
            "講話超快",
            "常說「這樣不好吧」"
        ]
    },
    {
        name: "羅志祥",
        hints: [
            "外號「小豬」",
            "舞蹈超強",
            "曾是綜藝大哥大班底",
            "有自己的舞蹈工作室",
            "演過好幾部偶像劇"
        ]
    },
    {
        name: "周星馳",
        hints: [
            "人稱「星爺」",
            "是香港演員",
            "很少上真人秀節目",
            "拍過很多經典喜劇",
            "來賓時常常不講話"
        ]
    },
    {
        name: "曾之喬",
        hints: [
            "曾是女團成員",
            "外型甜美",
            "演過很多偶像劇",
            "有點天然呆",
            "嫁給辰亦儒"
        ]
    },
    {
        name: "大S",
        hints: [
            "小S的姐姐",
            "本名徐熙媛",
            "演過流星花園",
            "嫁過汪小菲",
            "和具俊曄再婚"
        ]
    },
    {
        name: "阿雅",
        hints: [
            "小S的閨蜜",
            "是女藝人",
            "經常和小S、大S一起上節目",
            "有開服飾店",
            "個性爽朗"
        ]
    },
    {
        name: "范曉萱",
        hints: [
            "是歌手出身",
            "外號「小布」",
            "和阿雅是好友",
            "演過《流星花園》",
            "有雙胞胎兒子"
        ]
    },
    {
        name: "林志玲",
        hints: [
            "台灣第一名模",
            "身高很高",
            "說話聲音很甜",
            "和AKIRA結婚",
            "常被模仿說話方式"
        ]
    },
    {
        name: "蔡依林",
        hints: [
            "外號「天后」",
            "舞蹈很厲害",
            "唱歌很強",
            "出道時被稱為「少男殺手」",
            "和周杰倫交往過"
        ]
    },
    {
        name: "張惠妹",
        hints: [
            "外號「阿妹」",
            "原住民歌手",
            "唱功超強",
            "有很多經典歌曲",
            "演唱會很難搶票"
        ]
    },
    {
        name: "陶晶瑩",
        hints: [
            "外號「陶子」",
            "主持功力一流",
            "說話很直接",
            "和李李仁結婚",
            "曾主持過「大學生了沒」"
        ]
    },
    {
        name: "SHE",
        hints: [
            "台灣知名女團",
            "由三個人組成",
            "成員有Selina、Hebe、Ella",
            "出道二十多年",
            "是超級巨星"
        ]
    },
    {
        name: "郭采潔",
        hints: [
            "是歌手也是演員",
            "演過《痞子英雄》",
            "笑聲很特別",
            "個性直率",
            "和金城武合作過"
        ]
    },
    {
        name: "楊丞琳",
        hints: [
            "外號「小rainie」",
            "演過《流星花園》",
            "和李榮浩結婚",
            "有「婚紗女王」稱號",
            "唱過《曖昧》"
        ]
    }
];

let currentCelebrity = null;
let usedHints = [];
let score = 0;
let hintsLeft = 3;

// 已經出現過的藝人索引
let usedCelebrityIndices = [];

// 遊戲狀態
const gameState = {
    isPlaying: false,
    currentIndex: -1,
    wrongGuesses: 0
};

// 開始新遊戲
function startNewGame() {
    gameState.isPlaying = true;
    
    // 如果所有藝人都被猜過了，重置已使用列表
    if (usedCelebrityIndices.length >= celebrities.length) {
        usedCelebrityIndices = [];
        alert('已經猜過所有藝人了！重新開始新的回合。');
    }
    
    // 選擇一個還沒出現過的藝人
    let availableIndices = celebrities.map((_, index) => index)
        .filter(index => !usedCelebrityIndices.includes(index));
    
    gameState.currentIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedCelebrityIndices.push(gameState.currentIndex);
    
    currentCelebrity = celebrities[gameState.currentIndex];
    usedHints = [];
    hintsLeft = 3;
    gameState.wrongGuesses = 0; // 重置錯誤次數
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
        gameState.wrongGuesses = 0; // 重置錯誤次數
    } else {
        gameState.wrongGuesses++;
        if (gameState.wrongGuesses >= 6) {
            resultElement.textContent = `答錯六次了！正確答案是：${currentCelebrity.name}`;
            resultElement.className = 'wrong';
            gameState.isPlaying = false;
            gameState.wrongGuesses = 0; // 重置錯誤次數
        } else {
            resultElement.textContent = `猜錯了，還剩下${6 - gameState.wrongGuesses}次機會！`;
            resultElement.className = 'wrong';
        }
    }
    
    updateUI();
}

// 更新UI
function updateUI() {
    const hintList = document.getElementById('hint-list');
    const scoreElement = document.getElementById('score');
    const hintsLeftElement = document.getElementById('hints-left');
    const remainingGuessesElement = document.createElement('p');
    remainingGuessesElement.textContent = `剩餘猜測次數：${6 - gameState.wrongGuesses}`;
    
    // 更新提示列表
    hintList.innerHTML = usedHints.map(hint => `<li>${hint}</li>`).join('');
    
    // 更新分數和剩餘提示數
    scoreElement.textContent = score;
    hintsLeftElement.textContent = hintsLeft;
    
    // 更新剩餘猜測次數顯示
    const statsDiv = document.getElementById('stats');
    const existingRemainingGuesses = statsDiv.querySelector('.remaining-guesses');
    if (existingRemainingGuesses) {
        statsDiv.removeChild(existingRemainingGuesses);
    }
    remainingGuessesElement.className = 'remaining-guesses';
    statsDiv.appendChild(remainingGuessesElement);
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