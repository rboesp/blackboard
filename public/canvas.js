const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
ctx.lineWidth = 10
ctx.lineCap = "round"
ctx.strokeStyle = "red"
const bounds = canvas.getBoundingClientRect()
const socket = io()

canvas.addEventListener("mousedown", emitStartPosition)
canvas.addEventListener("mouseup", emitFinishedPosition)

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

//variables

//functions
function draw(e) {
    if (!painting) return
    // ctx.beginPath()
    ctx.lineTo(translatedX(e.clientX), translatedY(e.clientY))
    ctx.stroke()
    // clientDrawBox.beginPath()
    ctx.moveTo(translatedX(e.clientX), translatedY(e.clientY))
    // clientDrawBox.closePath()
}

//drawing - need this as as named function for removing listener
const moving = (event) => emitDrawPoints("userDrawing", event)

//start drawing
const emitStartPosition = (event) => {
    canvas.addEventListener("mousemove", moving) //start capturing the user dragging mouse
    emitDrawPoints("userDrawing", event) //emit the current point, prob not needed
    ctx.beginPath() //not here...
}

//a client released the mouse after drawing now done drawing
const emitFinishedPosition = () => {
    ctx.closePath() //not here...
    socket.emit("stopDraw", "")
}

//a client is actively drawing a line with mousedown
const emitDrawPoints = (emitName, event) => {
    // console.log("emitting")
    const { clientX, clientY } = event
    socket.emit(emitName, { clientX, clientY })
}

/**SOCKET LISTENRS */
socket.on("draw", (position) => {
    draw(position)
    console.log(position.id)
})

socket.on("stopDraw", (id) => {
    // console.log(socket.id)
    canvas.removeEventListener("mousemove", moving, false)
    // ctx.closePath()
    // ctx.beginPath()
    // console.log("stop")
})
