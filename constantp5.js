width = 1000
height = 600

particles = []

class particle {
    constructor (y) {
        this.pos = { x: width, y: y }
        this.initialVect = { x: -1, y: 0 }
        this.perturbater = { x: 0, y: 0 }
        this.pusher = { x: 0, y: 0 }
        this.color = color(17, 41, 255)
    }

    move() {
        // this.pushed(particles.filter((el) => isInRange(el, this, 10)))
        this.pertubation()
        this.pos.x += this.initialVect.x + this.pusher.x + this.perturbater.x
        this.pos.y += this.initialVect.y + this.pusher.y + this.perturbater.y
    }
    repeat() {
        if (this.pos.x > width) {
            this.pos.x = 0
        }
        if (this.pos.x < 0) {
            this.pos.x = width
        }
        if (this.pos.y > height) {
            this.pos.y = 0
        }
        if (this.pos.y < 0) {
            this.pos.y = height
        }
    }
    pertubation() {
        if (isInRange(this, { pos: { x: mouseX, y: mouseY } }, 30)) {
            let factor = 1
            let xForce = 0
            let yForce = 0
            let futurPos = {
                x: this.pos.x + this.initialVect.x + this.pusher.x,
                y: this.pos.y + this.initialVect.y + this.pusher.y,
            }
    
            if (Math.abs(futurPos.x - mouseX) < Math.abs(this.pos.x - mouseX)) {
                xForce = getPerturbationForce(Math.abs(this.pos.x - mouseX))
            }
            if (Math.abs(futurPos.y - mouseY) < Math.abs(this.pos.y - mouseY)) {
                yForce = getPerturbationForce(Math.abs(this.pos.y - mouseY))
            }

            factor = this.pos.x - mouseX >= 0 ? 1 : -1
            this.perturbater.x = this.perturbater.x + xForce * factor

            factor = this.pos.y - mouseY >= 0 ? 1 : -1
            this.perturbater.y = this.perturbater.y + yForce * factor
        } else {
            this.perturbater.x -= 0.1
            this.perturbater.y -= 0.1

            if (this.perturbater.x < 0) this.perturbater.x = 0
            if (this.perturbater.y < 0) this.perturbater.y = 0
        }
    }
    pushed(filteredParticles) {
        let factor = 1
        this.pusher.x = 0
        this.pusher.y = 0
        for (let index = 0; index < filteredParticles.length; index++) {
            const pushingParticle = filteredParticles[index];
            let xDist = Math.abs(pushingParticle.pos.x - this.pos.x)
            let yDist = Math.abs(pushingParticle.pos.y - this.pos.y)

            let xForce =  getPushedForce(xDist)
            factor = this.pos.x - pushingParticle.pos.x >= 0 ? 1 : -1
            this.pusher.x = this.pusher.x + xForce * factor

            let yForce =  getPushedForce(yDist)
            factor = this.pos.y - pushingParticle.pos.y >= 0 ? 1 : -1
            this.pusher.y = this.pusher.y + yForce * factor
        }
    }
    show() {
        fill(this.color)
        circle(this.pos.x, this.pos.y, 4)
    }
}

function getPerturbationForce(val) {
    if (val > 0 ) return 1 / val
    return 1
}

function getPushedForce(val) {
    if (val > 0 ) return 1 / val / 2
    return 1
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function addParticle() {
    for (let index = 0; index < height; index++) {
        if (getRandomInt(500) === 1) {
            particles.push(new particle(index))
        }
    }
}

function isInRange(a, b, range) {
    let minX = b.pos.x - range;
    let maxX = b.pos.x + range;
    let minY = b.pos.y - range;
    let maxY = b.pos.y + range;

    return a.pos.x >= minX
        && a.pos.x <= maxX
        && a.pos.y >= minY
        && a.pos.y <= maxY
}

function setup() {
    createCanvas(600, 600);
    background(51);
}

function  draw() {
    background(51,);
    if (particles.length < width * 2) {
        addParticle();
    }
    for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        particle.move()
        particle.repeat()
        particle.show()
    }
    
}