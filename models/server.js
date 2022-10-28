import express from "express";
import cors from "cors";
import http from "http";
import { Server as Socket } from "socket.io";
import { socketController } from "../sockets/controller.js";

export default class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Socket(this.server);
        this.paths = {};

        // Middlewares
        this.middlewares();

        // My application routes
        this.routes();

        this.sockets();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.static("public"));
    }

    routes() {}

    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io));
    }

    run() {
        this.server.listen(this.port, () =>
            console.log("Server running on port", this.port)
        );
    }
}
