const fs = require("fs")

function getCount(count) {
    count.count++
    console.log(count.count)
    return count.count === 1 ? "#client1" : "#client2"
}

module.exports = function (io) {
    const count = { count: 0 }

    //SOCKET LISTENERS
    io.on("connection", (socket) => {
        console.log(socket.id)

        io.to(socket.id).emit("player", getCount(count))

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
            io.emit("player", "#client1")
            console.log(count.count)
        })
    })
}
