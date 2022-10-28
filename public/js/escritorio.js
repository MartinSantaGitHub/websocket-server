// HTML References
const lblDesktop = document.querySelector("h1");
const btnAttend = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlert = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
    window.location = "index.html";
    throw new Error("El escritorio es obligatorio");
}

const desktop = searchParams.get("escritorio");
const socket = io();

lblDesktop.textContent = desktop;
divAlert.style.display = "none";

socket.on("connect", () => {
    console.log("Connected");

    btnAttend.disabled = false;
});

socket.on("disconnect", () => {
    btnAttend.disabled = true;
});

socket.on("pending-tickets", ({ pending }) => {
    if (pending === 0) {
        lblPendientes.style.display = "none";
        divAlert.style.display = "";
    } else {
        divAlert.style.display = "none";
        lblPendientes.style.display = "";
        lblPendientes.textContent = pending;
    }
});

btnAttend.addEventListener("click", (e) => {
    socket.emit("attend-ticket", { desktop }, ({ ok, ticket, msg }) => {
        if (!ok && msg.includes("no more tickets")) {
            return (lblTicket.textContent = "No One");
        }

        lblTicket.textContent = `Ticket ${ticket.number}`;
    });
});
