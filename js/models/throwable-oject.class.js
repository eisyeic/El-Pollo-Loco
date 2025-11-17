class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x -15;
        this.y = y + 60;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    throw(x, y) {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
    
}