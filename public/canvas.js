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
let painting = false

function draw(e) {
    if (!painting) return
    // ctx.beginPath()
    ctx.lineTo(translatedX(e.clientX), translatedY(e.clientY))
    ctx.stroke()
    // clientDrawBox.beginPath()
    ctx.moveTo(translatedX(e.clientX), translatedY(e.clientY))
    // clientDrawBox.closePath()
}

const moving = (event) => emitDrawMove("userDrawing", event)

//send
const emitStartPosition = (event) => {
    canvas.addEventListener("mousemove", moving) //start capturing the user dragging mouse
    emitDrawMove("userDrawing", event) //emit the current point, prob not needed
    ctx.beginPath()
}

//send
//same as above
const emitFinishedPosition = () => {
    ctx.closePath()
    painting = false
    socket.emit("stopDraw", "")
}

const emitDrawMove = (emitName, event) => {
    // console.log("emitting")
    const { clientX, clientY } = event
    socket.emit(emitName, { clientX, clientY })
}

/**SOCKET LISTENRS */
socket.on("draw", (position) => {
    painting = true
    draw(position)
    console.log(position.id)
})

socket.on("stopDraw", (id) => {
    // console.log(socket.id)
    painting = false
    canvas.removeEventListener("mousemove", moving, false)
    // ctx.closePath()
    // ctx.beginPath()
    // console.log("stop")
})
