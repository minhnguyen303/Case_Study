class Car {
    constructor(img, x, y) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.height = 85;
        this.width = 60;
        this.speed = 10;
        this.fuel = 100;
        this.maxFuel = 100;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    addFuel(num) {
        this.fuel += num;
    }

    setFuel(num) {
        this.fuel = num;
    }

    move(direc) {
        if (direc === 'ArrowLeft')
            this.x -= this.speed;
        else
            this.x += this.speed;
    }
}


