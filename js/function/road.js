function drawLane() {
    if (isPlayGame) {
        for (let i = 0; i < 10; i++) {
            if (yLane === -60) {
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
