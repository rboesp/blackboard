const canvas = document.querySelector("#client1")
const ctx = canvas.getContext("2d")
const canvas2 = document.querySelector("#client2")
const ctx2 = canvas2.getContext("2d")
const socket = io()
// ctx.setLineDash([5, 3])

// resize()

//variables
let painting = false

ctx.lineWidth = 10
ctx.lineCap = "round"
ctx.strokeStyle = "red"
ctx2.lineWidth = 10
ctx2.lineCap = "round"
ctx2.strokeStyle = "red"
var bounds = canvas.getBoundingClientRect()

// canvas.style.background = "blue"

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

function draw(e, clientDrawBox) {
    if (!painting) return
    // ctx.beginPath()
    // ctx.moveTo(translatedX(e.clientX), translatedY(e.clientY))
    clientDrawBox.lineTo(translatedX(e.clientX), translatedY(e.clientY))
    clientDrawBox.stroke()
    clientDrawBox.moveTo(translatedX(e.clientX), translatedY(e.clientY))
    // ctx.beginPath()
}

const moving = (event) => emit("userDrawing", event)

//send
// //do the body when emit comes back
const emitStartPosition = (event) => {
    canvas.addEventListener("mousemove", moving) //thie next drags
    canvas2.addEventListener("mousemove", moving) //thie next drags
    emit("userDrawing", event) //this time
}

const emit = (name, event) => {
    // console.log("emitting")
    const { clientX, clientY } = event
    socket.emit(name, { clientX, clientY })
}

//send
//same as above
const emitFinishedPosition = () => {
    // ctx.closePath()
    painting = false
    socket.emit("stopDraw", "")
}

/**LISTENRS */
//EventListeners
canvas.addEventListener("mousedown", emitStartPosition)
canvas.addEventListener("mouseup", emitFinishedPosition)
canvas2.addEventListener("mousedown", emitStartPosition)
canvas2.addEventListener("mouseup", emitFinishedPosition)
// canvas.addEventListener("mouseenter", drawing())

function findCorrectClient(position) {
    console.log(position.id, "***", socket.id)
    return position.id === socket.id ? ctx : ctx2
}

/**SOCKET LISTENRS */
socket.on("draw", (position) => {
    painting = true
    draw(position, findCorrectClient(position))
    console.log(position.id)
})

socket.on("stopDraw", (id) => {
    // console.log(socket.id)
    painting = false
    canvas.removeEventListener("mousemove", moving, false)
    // ctx.closePath()
    canvas2.removeEventListener("mousemove", moving, false)
    ctx.beginPath()
    ctx2.beginPath()
    // console.log("stop")
})
