const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const socket = io()

// resize()

//variables
let painting = false

canvas.style.background = "blue"

function translatedX(x) {
    var rect = canvas.getBoundingClientRect()
    var factor = canvas.width / rect.width
    return factor * (x - rect.left)
}

function translatedY(y) {
    var rect = canvas.getBoundingClientRect()
    var factor = canvas.width / rect.width
    return factor * (y - rect.top)
}

function draw(e) {
    if (!painting) return
    ctx.lineWidth = 10
    ctx.lineCap = "round"
    ctx.strokeStyle = "red"
    var bounds = canvas.getBoundingClientRect()

    ctx.beginPath()
    ctx.lineTo(translatedX(e.clientX), translatedY(e.clientY))
    ctx.stroke()
    ctx.moveTo(translatedX(e.clientX), translatedY(e.clientY))
}

const moving = (event) => emit("userDrawing", event)

//send
// //do the body when emit comes back
const emitStartPosition = (event) => {
    canvas.addEventListener("mousemove", moving) //thie next drags
    emit("userDrawing", event) //this time
}

const emit = (name, event) => {
    console.log("emitting")
    const { clientX, clientY } = event
    socket.emit(name, { clientX, clientY })
}

//send
//same as above
const emitFinishedPosition = () => {
    ctx.closePath()
    painting = false
    socket.emit("stopDraw", "")
}

/**LISTENRS */
//EventListeners
canvas.addEventListener("mousedown", emitStartPosition)
canvas.addEventListener("mouseup", emitFinishedPosition)
// canvas.addEventListener("mouseenter", drawing())

/**SOCKET LISTENRS */
socket.on("draw", (position) => {
    painting = true
    console.log(position)
    draw(position)
})

socket.on("stopDraw", () => {
    console.log("stop")
    painting = false
    canvas.removeEventListener("mousemove", moving, false)
    // ctx.closePath()
    ctx.beginPath()
})
