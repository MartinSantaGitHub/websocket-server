// HTML References
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCreate = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
    console.log("Connected");

    btnCreate.disabled = false;
});

socket.on("disconnect", () => {
    btnCreate.disabled = true;
});

socket.on("last-ticket", (payload) => {
    lblNuevoTicket.textContent = `Ticket ${payload.lastTicket}`;
});

btnCreate.addEventListener("click", (e) => {
    socket.emit("next-ticket", null, (ticket) => {
        lblNuevoTicket.textContent = ticket;
    });
});
