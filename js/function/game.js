const canvas = document.getElementById('screen');
const context = document.getElementById('screen').getContext('2d');
const imgMyCar = document.getElementById('myCar');
const imgOtherCar = document.getElementById('otherCar');
const imgFuel = document.getElementById('fuel');

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');

let yLane = -60;
let game;
let isPlayGame = false;
let isGameOver = false;

let myCar;
let otherCar;
let fuel;
let score = 0;
let bestScore = (loadScore()) ? +loadScore()[1] : 0;

/* ### Game control ### */

function loadGame() {
    window.addEventListener('keydown', onKeyDown);
    myCar = new Car(imgMyCar, (canvas.width / 2) - 30, canvas.height - 85);
    otherCar = new Car(imgOtherCar, 30, -85);
    fuel = new Fuel(imgFuel, 360, -80, 50);
    btnResume.disabled = true;
    btnPause.disabled = true;
    loadScore();
}

function startGame() {
    if (isGameOver){
        window.location = window.location;
    }
    saveScore();
    isPlayGame = true;
    btnStart.disabled = true;
    btnPause.disabled = false;
    btnResume.disabled = true;
    game = setInterval(updateScreen, 70);
    //let randTime = (Math.floor(Math.random() * (10 - 5)) + 5) * 1000;
    createOtherCar();
    createFuel();
}

function stopGame() {
    isPlayGame = false;
    clearInterval(game);
}

function gameOver() {
    stopGame();
    isGameOver = true;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.font = "50px Arial";
    context.fillStyle = '#ff0000';
    context.fillText('GAME OVER', 60, 240);
    context.closePath();
    /*document.getElementById('btn-control').innerHTML = '<button id="btn-start" onclick="startGame()">Start</button>\n' +
        '    <button onclick="resumeGame()">Play</button>\n' +
        '    <button onclick="pauseGame()">Pause</button>'*/
    btnStart.disabled = false;
    context.font = "30px Arial";
    let timeReload = 6;
    setInterval(function () {
        context.clearRect(60, 240, canvas.width, canvas.height);
        context.fillText('Tải lại trang sau ' + (timeReload-1) + 's', 85, 290);
        timeReload--;
        if (timeReload === 0){
            window.location = window.location;
        }
    }, 1000);
}

function pauseGame() {
    clearInterval(game);
    isPlayGame = false;
    document.getElementById('btn-pause').disabled = true;
    document.getElementById('btn-resume').disabled = false;
}

function resumeGame() {
    isPlayGame = true;
    game = setInterval(updateScreen, 70);
    if (otherCar.y === -85)
        createOtherCar(2500);
    else
        objMove('Car', otherCar.x);
    if (fuel.y === -80)
        createFuel(2500);
    else
        objMove('Fuel', fuel.x);
    document.getElementById('btn-resume').disabled = true;
    document.getElementById('btn-pause').disabled = false;
}

function onKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (!isOutScreen(myCar, canvas, event.key) && isPlayGame) {
            carMove(event.key);
        }
    }
}

/* ################# */


/* ### Game check ### */
function isOutScreen(obj, screen, direc) {
    if (direc === 'ArrowLeft' && (obj.x - obj.speed) < 0)
        return true;
    else if (direc === 'ArrowRight' && (obj.x + obj.width + obj.speed) > screen.width)
        return true;
    return false;
}

function checkInteractCar(obj1, obj2) {
    let left1 = obj1.x;
    let right1 = obj1.x + obj1.width;
    let top1 = obj1.y;
    let bottom1 = obj1.y + obj1.height;
    let left2 = obj2.x;
    let right2 = obj2.x + obj2.width;
    let top2 = obj2.y;
    let bottom2 = obj2.y + obj2.height;
    return !(right1 < left2 || bottom1 < top2 || left1 > right2 || top1 > bottom2);
}

/* ################# */


/* ### Game draw ### */

function drawCar(img, x, y) {
    context.beginPath();
    context.drawImage(img, x, y);
    context.closePath();
}

function drawFuel(img, x, y) {
    context.beginPath();
    context.drawImage(img, x, y);
    context.closePath();
}

function drawFuelBar(num) {
    let fuelBar = document.getElementById('fuelBar');
    fuelBar.innerText = myCar.fuel + "%";
    if (num >= 75) {
        fuelBar.style.backgroundColor = '#00ff00';
        fuelBar.style.color = '#000000';
    } else if (num < 75 && num >= 25)
        fuelBar.style.backgroundColor = '#ffff00';
    else
        fuelBar.style.backgroundColor = '#ff0000';
    fuelBar.style.width = num + "%";
}

function updateScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLane();
    drawCar(otherCar.img, otherCar.x, otherCar.y);
    drawCar(myCar.img, myCar.x, myCar.y);
    drawFuel(imgFuel, fuel.x, fuel.y);
    drawFuelBar(myCar.fuel)
    if (checkInteractCar(otherCar, myCar)) {
        gameOver();
    }
    if (checkInteractCar(fuel, myCar)) {
        addFuel(fuel.point);
        fuel.setPos(fuel.x, 600);
    }
    drawScore();
}

/* ################# */


/* ### Game .... ### */

function addFuel(num) {
    if ((myCar.fuel + num) > myCar.maxFuel)
        myCar.setFuel(100);
    else
        myCar.addFuel(num);
}

function createOtherCar(timeOut = 5000) {
    let randNum = Math.floor(Math.random() * 360);
    //console.log(randNum);
    setTimeout(objMove, timeOut, 'Car', randNum);
}

function createFuel(timeOut = 5000) {
    let randNum = Math.floor(Math.random() * 360);
    setTimeout(objMove, timeOut, 'Fuel', randNum);
}

function objMove(objType, x) {
    //console.log('' + objType + '-' + x + '-' + y )
    if (isPlayGame) {
        let randTime = Math.floor(Math.random() * 5) * 1000;
        if (objType === 'Car') {
            otherCar.setPos(parseInt(x), otherCar.y + 20);
            if (otherCar.y >= 600) {
                addScore(10);
                otherCar.y = -85;
                console.log('Tạo xe mới sau ' + randTime + 'giây');
                setTimeout(createOtherCar, randTime);
                return;
            }
            setTimeout(objMove, 100, 'Car', x);
        } else {
            fuel.setPos(parseInt(x), fuel.y + 25);
            if (fuel.y >= 600) {
                fuel.y = -80;
                fuel.point = Math.floor(Math.random() * (75 - 50)) + 50;
                console.log('Tạo fuel mới sau ' + randTime + 'giây');
                setTimeout(createFuel, randTime);
                return;
            }
            setTimeout(objMove, 100, 'Fuel', x);
        }
    }
}

function carMove(direc) {
    myCar.move(direc);
    if (myCar.fuel <= 0) {
        gameOver();
        return;
    }
    myCar.fuel--;
}

/* ################# */


loadGame();
