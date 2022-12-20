let width = window.innerWidth
let height = window.innerHeight

let particles = []

class particle {
    constructor (y) {
        this.pos = { x: width, y: y }
        this.initialVect = { x: -4, y: 0.03 }
        this.perturbater = { x: 0, y: 0 }
        this.pusher = { x: 0, y: 0 }
        this.color = color(17, 41, 255)
        // this.color = color(255,255, 255)
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
            // let factor = 1
            // let xForce = 0
            // let yForce = 0
            // let futurPos = {
            //     x: this.pos.x + this.initialVect.x + this.pusher.x,
            //     y: this.pos.y + this.initialVect.y + this.pusher.y,
            // }
    
            // if (Math.abs(futurPos.x - mouseX) < Math.abs(this.pos.x - mouseX)) {
            //     xForce = getPerturbationForce(Math.abs(this.pos.x - mouseX))
            // }
            // if (Math.abs(futurPos.y - mouseY) < Math.abs(this.pos.y - mouseY)) {
            //     yForce = getPerturbationForce(Math.abs(this.pos.y - mouseY))
            // }

            // factor = this.pos.x - mouseX >= 0 ? 1 : -1
            // this.perturbater.x = this.perturbater.x + xForce * factor

            // factor = this.pos.y - mouseY >= 0 ? 1 : -1
            // this.perturbater.y = this.perturbater.y + yForce * factor
            this.perturbater.x = (this.pos.x - mouseX) / 3
            this.perturbater.y = (this.pos.y - mouseY) / 2

        } else {
            let visc = 0.5
            if (this.perturbater.x > 0) {
                this.perturbater.x -= visc
            }
            else if (this.perturbater.x < 0) {
                this.perturbater.x += visc
            } else {
                this.perturbater.x = 0
            }
            if (this.perturbater.y > 0) {
                this.perturbater.y -= visc
            }
            else if (this.perturbater.y < 0) {
                this.perturbater.y += visc
            } else {
                this.perturbater.y = 0
            }
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
        // let diffX = Math.abs(this.perturbater.x + this.pusher.x)
        // let diffY =  Math.abs(this.perturbater.y + this.pusher.y)
        // let total = 255 - (diffX + diffY) * 40
        // if (total > 51) fill(color(17, 41, total))
        // else fill(color(51))
        fill(this.color);
        noStroke()
        circle(this.pos.x, this.pos.y, 4)
    }
}

function getPerturbationForce(val) {
    if (val > 0 ) return 1 / val
    return 1
}

function getPushedForce(val) {
    if (val > 0 ) return 1 / val
    return 1
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function addParticle() {
    let odds = 0
    let limit = 500

    if (particles.length < limit) {
        odds = limit
    } else {
        odds = particles.length
    }
    for (let index = 0; index < height; index++) {
        if (getRandomInt(odds) === 1) {
            particles.push(new particle(index))
        }
    }
}

function isInRange(a, b, range) {
    // square
    // let minX = b.pos.x - range;
    // let maxX = b.pos.x + range;
    // let minY = b.pos.y - range;
    // let maxY = b.pos.y + range;

    // return a.pos.x >= minX
    //     && a.pos.x <= maxX
    //     && a.pos.y >= minY
    //     && a.pos.y <= maxY

    //circle
    let dx = Math.abs(a.pos.x - b.pos.x)
    let dy = Math.abs(a.pos.y - b.pos.y)

    if (dx > range || dy > range) return false;
    if (dx + dy <= range) return true;
    if (dx * dx + dy * dy <= range * range) return true
    return false
}

function setup() {
    createCanvas(width, height);
    background(51);
}

function  draw() {
    background(51, 51, 51, 5);
    if (particles.length < width * 5) {
        addParticle();
    }
    for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        particle.move()
        particle.repeat()
        particle.show()
    }
    
}