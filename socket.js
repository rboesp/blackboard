const fs = require("fs")

module.exports = function (io) {
    //SOCKET LISTENERS
    io.on("connection", (socket) => {
        console.log(socket.id)

        /*
            a client is actively drawing 
        */
        socket.on("userDrawing", (move) => {
            console.log("drawing")
            io.emit("draw", move)
        })
        socket.on("stopDraw", () => {
            io.emit("stopDraw", "")
        })
        /*
            a client who is drawing hit the clear button
            so clear every nodes board
        */
        socket.on("clear", (arg) => {
            io.emit("clearBoard", "")
        })
        socket.on("disconnect", () => {
            console.log(socket.id + "left")
        })
    })
}
