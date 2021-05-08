canvas.addEventListener("mouseenter", drawing())
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

function drawing() {
    window.addEventListener("load", () => {
        const canvas = document.querySelector("#canvas")
        const ctx = canvas.getContext("2d")

        resize()

        //variables
        let painting = false

        function startPosition(e) {
            painting = true
            draw(e)
        }
        function finishedPosition() {
            painting = false
            ctx.beginPath()
        }
        function draw(e) {
            if (!painting) return
            ctx.lineWidth = 10
            ctx.lineCap = "round"
            ctx.strokeStyle = "red"
            var bounds = canvas.getBoundingClientRect()

            ctx.lineTo(translatedX(e.clientX), translatedY(e.clientY))
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(translatedX(e.clientX), translatedY(e.clientY))
        }

        //EventListeners
        canvas.addEventListener("mousedown", startPosition)
        canvas.addEventListener("mouseup", finishedPosition)
        canvas.addEventListener("mousemove", draw)
    })

    window.addEventListener("resize", resize)

    function resize() {
        //Resizing
        canvas.setAttribute("height", window.innerHeight)
        canvas.setAttribute("width", window.innerWidth)
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
    }
}

function download() {
    var download = document.getElementById("download")
    var image = document.getElementById("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream")
    download.setAttribute("href", image)
}
