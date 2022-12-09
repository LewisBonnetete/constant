var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Body = Matter.Body,
Bodies = Matter.Bodies,
Mouse = Matter.Mouse,
MouseConstraint = Matter.MouseConstraint,
Composite = Matter.Composite;

// create an engine
var engine = Engine.create();
engine.gravity.y = 0
engine.gravity.x = -0.2
engine.enableSleeping = true

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
let rainFrqc = 10000
let factor = -1
function makeRain() {
    rainFrqc = rainFrqc + (rainFrqc / 1000 * factor);
    if (rainFrqc < 100) factor = +1;
    if (rainFrqc > 1000) factor = -1;
    for (let index = 0; index < window.innerHeight; index += 1) {
        if (getRandomInt(rainFrqc) == 1) {
            var drop = Bodies.circle(window.innerWidth, index, 1);
            Body.setMass(drop, 0.00000001);
            Composite.add(engine.world, drop);
        }
    }
}

setInterval(makeRain, 10);

let mouseX = 0;
let mouseY = 0;
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
});

var mouseCircle = Bodies.circle(500, 500, 100, {});
Body.setMass(mouseCircle, 1000);
var mouse = Mouse.create();
var mConstraint = MouseConstraint.create(engine, mouse)

window.onkeydown = function(event){
    if(event.keyCode === 32) {
        event.preventDefault();
        Composite.add(engine.world, Bodies.circle(mouseX, mouseY, 50, {}));
    }
};

var ground = Bodies.rectangle( -500, window.innerHeight / 2 , 10, window.innerHeight * 2, {isStatic: true, isSleeping: true});


Composite.add(engine.world, [mConstraint]);

// set the size to the width and height
render.canvas.width = window.innerWidth;
render.canvas.height = window.innerHeight;

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);