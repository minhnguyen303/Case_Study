class Fuel {
    constructor(img, x, y, point) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
        this.point = point;
    }

    setPos(x, y){
        this.x = x;
        this.y = y;
    }
}