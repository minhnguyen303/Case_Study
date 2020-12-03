const canvas = document.getElementById('screen');
const context = document.getElementById('screen').getContext('2d');
const imgMyCar = document.getElementById('myCar');
const imgOtherCar = document.getElementById('otherCar');
const imgFuel = document.getElementById('fuel');

let yLane = -60;
let game;
let isPlayGame = false;

let myCar;
let otherCar;
let fuel;

// game control
function startGame() {
    isPlayGame = true;
    document.getElementById('btn-start').disabled = true;
    //document.getElementById('btn-resume').disabled = true;
    //document.getElementById('btn-pause').disabled = false;
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
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.font = "50px Arial";
    context.fillStyle = '#ff0000';
    context.fillText('GAME OVER', 60, 240);
    context.closePath();
    /*document.getElementById('btn-control').innerHTML = '<button id="btn-start" onclick="startGame()">Start</button>\n' +
        '    <button onclick="resumeGame()">Play</button>\n' +
        '    <button onclick="pauseGame()">Pause</button>'*/
    document.getElementById('btn-start').disabled = false;
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
    document.getElementById('btn-resume').disabled = true;
    document.getElementById('btn-pause').disabled = false;
}

function onKeyDown(event) {
    if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        if (!isOutScreen(myCar, canvas, event.key) && isPlayGame) {
            carMove(event.key);
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

function checkInteractCar(obj1, obj2) {
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
function loadGame() {
    window.addEventListener('keydown', onKeyDown);
    myCar = new Car(imgMyCar, (canvas.width / 2) - 30, canvas.height - 85);
    otherCar = new Car(imgOtherCar, 30, -85);
    fuel = new Fuel(imgFuel, 360, -80, 50);
    //document.getElementById('btn-resume').disabled = true;
    //document.getElementById('btn-pause').disabled = true;
}

// display
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

function createOtherCar() {
    let randNum = Math.floor(Math.random() * 360);
    //console.log(randNum);
    setTimeout(objMove, 5000, 'Car', randNum);
}

function createFuel() {
    let randNum = Math.floor(Math.random() * 360);
    setTimeout(objMove, 5000, 'Fuel', randNum);
}

function objMove(objType, x) {
    //console.log('' + objType + '-' + x + '-' + y )
    if (isPlayGame) {
        let randTime = Math.floor(Math.random() * 5) * 1000;
        if (objType === 'Car') {
            otherCar.setPos(parseInt(x), otherCar.y + 20);
            if (otherCar.y >= 600) {
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

function drawLane() {
    if (isPlayGame) {
        for (let i = 0; i < 10; i++) {
            if (yLane == -60) {
                yLane = -160;
            }
            context.beginPath();
            context.fillStyle = '#ffffff'
            context.rect(120, (i * 100) + yLane, 30, 60); //x, y , rộng, cao
            context.rect(270, (i * 100) + yLane, 30, 60); // y = thứ tự * chiều cao + vị trí đã di chuyển + khoảng cách
            context.fill();
            context.closePath();
            //console.log(yLane);
        }
        yLane += 20;
    }
}

function addFuel(i) {
    if (myCar.fuel > 50 && i > 50)
        myCar.fuel = 100;
    else
        myCar.fuel += i;
}

function drawFuelBar(num) {
    let str = '';
    if (num > 75) {
        str = 'Hi'
    }
    document.getElementById('fuelBar').style.width = num + "%";
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
        //console.log('' + fuel.x + '-' + fuel.y + '-' + fuel.width + '-' + fuel.height)
        addFuel(fuel.point);
        fuel.setPos(fuel.x, 600);
    }
}

