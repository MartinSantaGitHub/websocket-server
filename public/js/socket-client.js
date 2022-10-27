const lblOnline = document.querySelector("#lblOnline");
const lblOffline = document.querySelector("#lblOffline");
const txtMessage = document.querySelector("#txtMessage");
const btnSend = document.querySelector("#btnSend");

const socket = io();

socket.on("connect", () => {
    console.log("Connected");

    lblOffline.style.display = "none";
    lblOnline.style.display = "initial";
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");

    lblOffline.style.display = "initial";
    lblOnline.style.display = "none";
});

socket.on("send-message", (payload) => {
    console.log(payload);
});

btnSend.addEventListener("click", (e) => {
    const message = txtMessage.value;
    const payload = {
        message,
        id: "123xyz",
        date: new Date().toLocaleString(),
        from: "Client",
    };

    socket.emit("send-message", payload, (id) => {
        console.log("From server", id);
    });
});
