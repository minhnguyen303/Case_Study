const canvas = document.getElementById('screen');
const context = document.getElementById('screen').getContext('2d');
const imgMyCar = document.getElementById('myCar');
const imgOtherCar = document.getElementById('otherCar');
const imgFuel = document.getElementById('fuel');

let yLane = -60;
let game;
let isPlayGame = false;


// game control
function startGame() {
    document.getElementById('btn-start').remove();
    game = setInterval(updateScreen, 70);
    isPlayGame = true;
    //let randTime = (Math.floor(Math.random() * (10 - 5)) + 5) * 1000;
    createOtherCar();
}

function stopGame() {
    clearInterval(game);
}

function gameOver() {
    stopGame();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.font = "50px Arial";
    context.fillStyle = '#ff0000';
    context.fillText('GAME OVER', 60, 240);
    context.closePath();
    document.getElementById('btn-control').innerHTML = '<button id="btn-start" onclick="startGame()">Start</button>\n' +
        '    <button onclick="resumeGame()">Play</button>\n' +
        '    <button onclick="pauseGame()">Pause</button>'
}

function pauseGame() {
    clearInterval(game);
    isPlayGame = false;
}

function resumeGame() {
    game = setInterval(updateScreen, 70);
}

function onKeyDown(event) {
    if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        if (!isOutScreen(myCar, canvas, event.key) && isPlayGame) {
            myCar.move(event.key);
        }
    }
}

// game check
function isOutScreen(obj, screen, direc) {
    if (direc == 'ArrowLeft' && (obj.x - obj.speed) < 0)
        return true;
    else if (direc == 'ArrowRight' && (obj.x + obj.width + obj.speed) > screen.width)
        return true;
    return false;
}

function checkCrashCar(obj1, obj2) {
    let left1 = obj1.x;
    let right1 = obj1.x + obj1.width;
    let top1 = obj1.y;
    let bottom1 = obj1.y + obj1.height;
    let left2 = obj2.x;
    let right2 = obj2.x + obj2.width;
    let top2 = obj2.y;
    let bottom2 = obj2.y + obj2.height;
    if (right1 < left2 || bottom1 < top2 || left1 > right2 || top1 > bottom2) {
        return false;
    } else {
        return true;
    }
}

// game
window.addEventListener('keydown', onKeyDown);
let myCar = new Car(imgMyCar, (canvas.width / 2) - 30, canvas.height - 85);
let otherCar = new Car(imgOtherCar, 30, -85);
let fuel = new Fuel(imgFuel, 0, -60);

// display
function drawCar(img, x, y) {
    context.beginPath();
    context.drawImage(img, x, y);
    context.closePath();
}

function createOtherCar() {
    let randNum = Math.floor(Math.random() * 360);
    setTimeout(otherCarMove, 5000, randNum);
}

function otherCarMove(x, y = 0) {
    otherCar.setPos(parseInt(x), otherCar.y + 15);
    if (otherCar.y >= 500) {
        otherCar.y = -85;
        let randTime = (Math.floor(Math.random() * (15 - 10)) + 10) * 1000;
        setTimeout(createOtherCar, randTime);
        return;
    }
    y += 15;
    setTimeout(otherCarMove, 100, [x, y]);
}

function drawLane() {
    if (isPlayGame) {
        for (let i = 0; i < 10; i++) {
            if (yLane == -60) {
                yLane = -160;
            }
            context.beginPath();
            context.fillStyle = '#000000'
            context.rect(120, (i * 100) + yLane, 30, 60); //x, y , rộng, cao
            context.rect(270, (i * 100) + yLane, 30, 60); // y = thứ tự * chiều cao + vị trí đã di chuyển + khoảng cách
            context.fill();
            context.closePath();
            console.log(yLane);
        }
        yLane += 5;
    }
}

function createFuel() {
    let randNum = Math.floor(Math.random() * 360);
    setTimeout(objMove, 5000, randNum);
}

function objMove(objType, x, y = 0) {
    if (objType == 'Car'){
        otherCar.setPos(parseInt(x), otherCar.y + 15);
        if (otherCar.y >= 500) {
            otherCar.y = -85;
            let randTime = (Math.floor(Math.random() * (15 - 10)) + 10) * 1000;
            setTimeout(createOtherCar, randTime);
            return;
        }
        y += 15;
        setTimeout(otherCarMove, 100, [x, y]);
    }
    else {
        fuel.setPos(parseInt(x), fuel.y + 20);
        if (fuel.y >= 500) {
            fuel.y = -85;
            let randTime = (Math.floor(Math.random() * (15 - 10)) + 10) * 1000;
            setTimeout(createFuel, randTime);
            return;
        }
        y += 15;
        setTimeout(fuelMove, 100, ['fuel', x, y]);
    }
}


function updateScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLane();
    drawCar(otherCar.img, otherCar.x, otherCar.y);
    drawCar(myCar.img, myCar.x, myCar.y);
    if (checkCrashCar(otherCar, myCar)) {
        gameOver();
    }
}

