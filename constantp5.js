let width = window.innerWidth
let height = window.innerHeight
let particles = []
let particlesLimit = 2000

let globalPerturbation = 0
let nbrOfPerturbatedParticles = 0

let initialRange = 40
let range = initialRange
let bg = 51

let sound1
let sound2
let sound3
let timing = 40
let oldVolume = 0

let filter
let filterInteraction
let filterInteraction2

let isFullScreen = false
let ready = false

let mouseWasPressed = false
class particle {
    constructor (y) {
        this.pos = { x: width, y: y }
        this.initialVect = { x: -3.8, y: 0 + random(35) / 100 }
        this.perturbater = { x: 0, y: 0 }
        this.pusher = { x: 0, y: 0 }
        this.color = color(17, 41, 255)
        this.isPerturbated = false
    }

    move() {
        // this.pushed(particles.filter((el) => isInRange(el, this, 10)))
        // this.pertubation()
        this.pos.x += this.initialVect.x + this.pusher.x + this.perturbater.x
        this.pos.y += this.initialVect.y + this.pusher.y + this.perturbater.y

        let pertubationValue = Math.abs(this.perturbater.x) + Math.abs(this.perturbater.y)
        let perturbationState = pertubationValue > 0.99

        if (perturbationState) {
            globalPerturbation += pertubationValue
        }
        if (perturbationState && !this.isPerturbated) {
            // newly perturbated
            nbrOfPerturbatedParticles += 1
        }
        if (!perturbationState && this.isPerturbated) {
            // not anymore
            nbrOfPerturbatedParticles -= 1
        }
        
        this.isPerturbated = perturbationState

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
        if (mouseIsPressed && isInRange(this, { pos: { x: mouseX, y: mouseY } }, range)) {
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
    let oddLimit = 2000

    if (particles.length < oddLimit) {
        odds = oddLimit
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

function touchStarted () {
    var fs = fullscreen();
    if (!fs && !isFullScreen) {
        isFullScreen = true
        fullscreen(true);
    }
    ready = true;
  }
  
/* full screening will change the size of the canvas */
function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    width = window.innerWidth
    height = window.innerHeight
    background(bg)
}

/* prevents the mobile browser from processing some default
* touch events, like swiping left for "back" or scrolling the page.
*/
document.ontouchmove = function(event) {
    event.preventDefault();
};

function preload() {
    soundFormats('mp3');
    sound1 = loadSound('./constantSound.mp3');
    sound2 = loadSound('./constantSound.mp3');
    sound3 = loadSound('./constantSound.mp3');
}

function setup() {
    createCanvas(width, height)
    background(bg)
    filter = new p5.HighPass();
    filterInteraction = new p5.BandPass();
    filterInteraction2 = new p5.HighPass();
    filterInteraction2.freq(12000)
}

function play(sound) {
    if (!sound.isPlaying()) {
        sound.disconnect();
        sound.connect(filter);
        sound.play()
    }
}

function playInteractionSound() {
    if (!sound3.isPlaying()) {
        sound3.disconnect();
        sound3.connect(filterInteraction);
        sound3.connect(filterInteraction2);
        sound3.play()
        sound3.jump(getCurrentSound().currentTime())
    }
}

function getCurrentSound() {
    if (sound1.isPlaying()) {
        return sound1
    }
    return sound2
}

function  draw() {
    if (ready) {
        background(bg, bg, bg, 5)
        let nbrOfParticles = particles.length
    
        if (!sound1.isPlaying() && !sound2.isPlaying()) {
            play(sound1)
        }
        
        if (sound1.currentTime() > sound1.duration() - timing) {
            play(sound2)
        }
        if (sound2.currentTime() > sound2.duration() - timing) {
            play(sound1)
        }
    
        if (nbrOfParticles < particlesLimit) {
            addParticle()
        }
    
        let freq = map(nbrOfParticles, particlesLimit, 0, 0, 4500);
        freq = constrain(freq, 0, 22050);
        console.log('freq', freq, nbrOfParticles);
        
        filter.freq(freq);

        // playInteractionSound()
        // filterInteraction.res(globalPerturbation);
        // let val = map(nbrOfPerturbatedParticles, 0, 30, 6000, 15000)
        // val = constrain(val, 6000, 15000)
        // filterInteraction.freq(val)
        // globalPerturbation /= 1.1
        // let pertubationVolume = map(globalPerturbation, 30, 100, 0, 1)
        // pertubationVolume = constrain(pertubationVolume, 0, 1)
        // if (oldVolume < pertubationVolume) {
        //     sound3.setVolume(oldVolume += pertubationVolume / 5)
        // } else {
        //     sound3.setVolume(oldVolume -= pertubationVolume / 5)
        // }

    
        // if (mouseIsPressed) {
        //     range -= range / initialRange / 10
        // } else {
        //     range = initialRange
        // }
    
        for (let index = 0; index < particles.length; index++) {
            const particle = particles[index]
            particle.move()
            particle.repeat()
            particle.show()
        }
    } else {
        background(bg)
        textAlign(CENTER, TOP);
        textSize(32);
        fill(255)
        text('Click to start', width / 2, height / 2);
    }
    // if (mouseWasPressed && !mouseIsPressed) {
    //     sound3.jump(getCurrentSound().currentTime() + random(100))
    // }
    // mouseWasPressed = mouseIsPressed
}