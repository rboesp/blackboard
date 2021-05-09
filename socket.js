const fs = require("fs")

module.exports = function (io) {
    const count = { count: 0 }

    //SOCKET LISTENERS
    io.on("connection", (socket) => {
        console.log(socket.id)
        count.count++

        io.to(socket.id).emit("player", count.count === 1 ? "#client1" : "#client2")

        /*
            a client is actively drawing 
        */
        socket.on("userDrawing", (move) => {
            console.log("drawing")
            const id = socket.id
            io.emit("draw", { ...move, id })
        })
        socket.on("stopDraw", () => {
            io.emit("stopDraw", socket.id)
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
            count.count--
        })
    })
}
