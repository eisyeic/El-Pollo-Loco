class ThrowableObject extends MovableObject {

    Bottle_Rotation = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    Bottle_Splash = [
        "img/6_salsa_bottle/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_splash/4_bottle_splash.png",
    ];

    /**
     * Creates a new ThrowableObject instance
     * @param {number} x - X coordinate position
     * @param {number} y - Y coordinate position
     * @param {boolean} direction - Throw direction (true for left, false for right)
     */
    constructor(x, y, direction) {
        super().loadImage(this.Bottle_Rotation[0]);
        this.loadImages(this.Bottle_Rotation);
        this.x = x - 15;
        this.y = y + 60;
        this.height = 60;
        this.width = 50;
        this.direction = direction;
        this.throw();
        this.animate();
    }

    /**
     * Initiates the throwing motion with gravity and horizontal movement
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += this.direction ? -10 : 10;
        }, 25);
    }

    /**
     * Starts the bottle rotation animation
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.Bottle_Rotation);
        }, 100);
    }
}
