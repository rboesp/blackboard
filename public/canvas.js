const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
ctx.lineWidth = 1
ctx.lineCap = "round"
ctx.strokeStyle = "white"
const bounds = canvas.getBoundingClientRect()
const socket = io()

const player = () => {
    lastPos: null
}
const players = new Map()

socket.on("addPlayer", (id) => {
    //make player
    addNewPlayer(id)
})
socket.on("removePlayer", (id) => {
    players.delete(id)
})

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

function addNewPlayer(id) {
    players.set(id, player())
}

//variables

//functions
function drawLine(position, lastPosition) {
    ctx.beginPath()
    ctx.moveTo(translatedX(lastPosition.clientX), translatedY(lastPosition.clientY))
    ctx.lineTo(translatedX(position.clientX), translatedY(position.clientY))
    ctx.stroke()
    ctx.closePath()
}

//drawing - need this as as named function for removing listener
const moving = (event) => emitDrawPoints("userDrawing", event)

//start drawing
const emitStartPosition = (event) => {
    canvas.addEventListener("mousemove", moving) //start capturing the user dragging mouse
    emitDrawPoints("userDrawing", event) //emit the current point, prob not needed
}

//a client released the mouse after drawing now done drawing
const emitFinishedPosition = () => {
    socket.emit("stopDraw", "")
}

//a client is actively drawing a line with mousedown
const emitDrawPoints = (emitName, event) => {
    // console.log("emitting")
    const { clientX, clientY } = event
    socket.emit(emitName, { clientX, clientY })
}

function getLastPosition(id) {
    return players.get(id)
}

function updateLastPosition(pos, id) {
    players.set(id, pos)
}

/**EVENT LISTENERS */
canvas.addEventListener("mousedown", emitStartPosition)
canvas.addEventListener("mouseup", emitFinishedPosition)

/**SOCKET LISTENRS - ie receiving emits from server */

//this handles mousedown and mousemove from client - either starting or drawing their line
socket.on("draw", (clientDraw) => {
    const { clientX, clientY, id } = clientDraw
    const position = { clientX, clientY }
    const lastPosition = getLastPosition(id) || position
    drawLine(position, lastPosition)
    updateLastPosition(position, id)
    console.log(id)
})

//this handles mouseup from client - they are done drawing their line
socket.on("stopDraw", (id) => {
    //clear the clients old x y
    addNewPlayer(id) //overwrite

    canvas.removeEventListener("mousemove", moving, false)
})
