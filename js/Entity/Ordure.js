var Ordure {
    name : "ordure",
    sprite: "",
    speed : Math.floor(Math.random() * (1 - 5 + 1)) + min,
    spin : Math.floor(Math.random() * (1 - 5 + 1)) + min,
    isTouched : false,
    isGood : false;
}

//Ordure.constructor === Object;

function Ordure(name, sprite, speed, spin, isTouched) {
    this.name = name;
    this.sprite = sprite;
    this.speed = speed;
    this.spinSpeed = spinSpeed;
    this.isTouched = isTouched;
}