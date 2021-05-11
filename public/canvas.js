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
    //need an id here
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

/**SOCKET LISTENRS - ie receiving emits from server */

//this handles mousedown and mousemove from client - either starting or drawing their line
socket.on("draw", (position) => {
    //this is where we need to know which client cause the emit
    //
    draw(position)
    console.log(position.id)
})

//this handles mouseup from client - they are done drawing their line
socket.on("stopDraw", (id) => {
    //here is where I would clear the clients old x y
    canvas.removeEventListener("mousemove", moving, false)
})
