import TicketControl from "../models/ticket-control.js";

const ticketControl = new TicketControl();

const socketController = (socket, io) => {
    socket.emit("last-ticket", { lastTicket: ticketControl.last });
    socket.emit("current-status", { lastFour: ticketControl.lastFour });
    io.emit("pending-tickets", { pending: ticketControl.tickets.length });

    socket.on("next-ticket", (payload, callback) => {
        const next = ticketControl.next();

        callback(next);

        // Notify a new ticket
        io.emit("pending-tickets", { pending: ticketControl.tickets.length });
    });

    socket.on("attend-ticket", ({ desktop }, callback) => {
        if (!desktop) {
            return callback({
                ok: false,
                msg: "The desktop is required",
            });
        }

        const ticket = ticketControl.takeTicket(desktop);

        // TODO: Notify last four
        socket.broadcast.emit("current-status", {
            lastFour: ticketControl.lastFour,
        });

        io.emit("pending-tickets", { pending: ticketControl.tickets.length });

        if (!ticket) {
            callback({
                ok: false,
                msg: "There's no more tickets",
            });
        } else {
            callback({
                ok: true,
                ticket,
            });
        }
    });
};

export { socketController };
