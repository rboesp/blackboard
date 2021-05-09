let canvas
let ctx
let bounds
const socket = io()

//variables
let painting = false

socket.on("player", (name) => {
    canvas = document.querySelector(name)
    ctx = canvas.getContext("2d")
    ctx.lineWidth = 10
    ctx.lineCap = "round"
    ctx.strokeStyle = "red"

    bounds = canvas.getBoundingClientRect()

    /**LISTENRS */
    //EventListeners
    canvas.addEventListener("mousedown", emitStartPosition)
    canvas.addEventListener("mouseup", emitFinishedPosition)

    console.log(canvas)
})

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

/**SOCKET LISTENRS */
socket.on("draw", (position) => {
    painting = true
    draw(position, ctx)
    console.log(position.id)
})

socket.on("stopDraw", (id) => {
    // console.log(socket.id)
    painting = false
    canvas.removeEventListener("mousemove", moving, false)
    // ctx.closePath()
    ctx.beginPath()
    // console.log("stop")
})
