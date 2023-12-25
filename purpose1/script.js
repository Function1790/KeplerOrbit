const HTML = {
    vel: document.getElementById("vel"),
    radius: document.getElementById("radius"),
    T: document.getElementById("T"),
    controllerA: document.getElementById("controllA"),
    controllAText: document.getElementById("controllAText")
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const O = { x: 400, y: 400 }

const PI2 = Math.PI * 2
const data = {
    G: 400
}

const orbit = {
    a: 200,
    e: 0.6,
    points: [],
    count: 100
}
orbit.b = orbit.a * Math.sqrt(1 - orbit.e ** 2)
orbit.focus1 = -Math.sqrt(orbit.a ** 2 - orbit.b ** 2)
orbit.focus2 = -orbit.focus1
HTML.controllerA.value = orbit.a

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    sizeSquare() {
        return this.x ** 2 + this.y ** 2
    }
    normalized() {
        var size = Math.sqrt(this.sizeSquare())
        return new Vector(this.x / size, this.y / size)
    }
    mul(m) {
        this.x *= m
        this.y *= m
    }
    toStr() {
        return `(${this.x}, ${this.y})`
    }
}

function floor(v, n) {
    return Math.floor(v * 10 ** n) / 10 ** n
}

class Planet {
    constructor(vel, mass) {
        this.seta = 0
        this.mass = mass
        this.vel = new Vector(vel[0], vel[1])
        this.T = 0
        this.tick = 0
    }
    get x() { return orbit.a * Math.cos(this.seta) }
    get y() { return orbit.b * Math.sin(this.seta) }
    get r() {
        return new Vector(this.x - orbit.focus1, this.y)
    }
    move() {
        this.seta += 0.01
    }
    draw() {
        var x = this.x
        var y = this.y
        ctx.fillStyle = 'rgb(15,155,255)'
        ctx.beginPath()
        ctx.arc(O.x + x, O.y + y, 10, 0, PI2)
        ctx.fill()
        ctx.closePath()
    }
    get direction() {
        var inc = new Vector(-orbit.a * Math.sin(seta), orbit.b * Math.cos(seta))
        return inc.normalized()
    }
}


function drawOrbit() {
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgb(255,255,255)'
    ctx.beginPath()
    ctx.moveTo(O.x + orbit.points[0][0], O.y)
    for (var i in orbit.points) {
        ctx.lineTo(O.x + orbit.points[i][0], O.y + orbit.points[i][1])
    }
    ctx.stroke()
    ctx.closePath()
}

/*Event Function*/
HTML['controllerA'].addEventListener('mousemove', () => {
    orbit.a = HTML['controllerA'].value
    orbit.b = orbit.a * Math.sqrt(1 - orbit.e ** 2)
    orbit.focus1 = -Math.sqrt(orbit.a ** 2 - orbit.b ** 2)
    orbit.focus2 = -orbit.focus1
    star.x = orbit.focus1
    HTML['controllAText'].innerText = `a = ${orbit.a}AU`
    orbit.points = []

    for (var i = 0; i < orbit.count + 1; i++) {
        var seta = Math.PI * 2 * i / orbit.count
        orbit.points.push([orbit.a * Math.cos(seta), orbit.b * Math.sin(seta)])
    }
})

//Main
const star = {
    x: orbit.focus1,
    y: 0,
    mass: 10,
    draw: () => {
        ctx.fillStyle = 'rgb(255,125,55)'
        ctx.beginPath()
        ctx.arc(O.x + star.x, O.y + star.y, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}

var planet = new Planet([0, 5], 1)

for (var i = 0; i < orbit.count + 1; i++) {
    var seta = Math.PI * 2 * i / orbit.count
    orbit.points.push([orbit.a * Math.cos(seta), orbit.b * Math.sin(seta)])
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawOrbit()
    star.draw()
    planet.draw()
    planet.move()
    requestAnimationFrame(render)
}

render()