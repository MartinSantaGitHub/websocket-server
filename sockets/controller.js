const socketController = (socket) => {
    console.log("Connected Client", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected Client");
    });

    socket.on("send-message", (payload, callback) => {
        console.log(payload);

        callback("ZYX-321");

        payload.date = new Date().toLocaleString();
        payload.from = "Server";

        socket.broadcast.emit("send-message", payload);
    });
};

export { socketController };
