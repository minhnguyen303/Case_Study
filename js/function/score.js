let scoreLabel = document.getElementById('scoreLabel');
let bestScoreLabel = document.getElementById('bestScoreLabel');

function addScore(){
    score += 10;
    addScoreAnimation();
    if (score > bestScore)
        newBestScore()
    saveScore();
}

function addScoreAnimation(){
    let time = 5;
    setInterval(function () {
        scoreLabel.style.color = '#ff0000';
        setTimeout(function () {
            scoreLabel.style.color = '#ffffff';
            time--;
        }, 100);
    }, 100);
    for (let i = 5; i > 0; i--) {

    }
}

function newBestScore() {
    bestScore = score;
}

function saveScore() {
    localStorage.setItem('score', ""+score)
    localStorage.setItem('bestScore', ""+bestScore)
}

function loadScore() {
    return [localStorage.getItem('score'), localStorage.getItem('bestScore')];
}

function drawScore() {
    scoreLabel.innerText = "Score: " + score;
    bestScoreLabel.innerText = "Best score: " + bestScore;
}
