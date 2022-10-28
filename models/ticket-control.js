import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dataJson from "../db/data.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Ticket {
    constructor(number, desktop) {
        this.number = number;
        this.desktop = desktop;
    }
}

export default class TicketControl {
    constructor() {
        this.last = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.lastFour = [];

        this.init();
    }

    get toJson() {
        return {
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            lastFour: this.lastFour,
        };
    }

    saveDB() {
        const dbPath = path.join(__dirname, "../db/data.json");

        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    init() {
        const { today, lastFour, last, tickets } = dataJson;

        if (today === this.today) {
            this.tickets = tickets;
            this.last = last;
            this.lastFour = lastFour;
        } else {
            this.saveDB();
        }
    }

    next() {
        this.last += 1;

        const ticket = new Ticket(this.last, null);

        this.tickets.push(ticket);

        this.saveDB();

        return `Ticket ${ticket.number}`;
    }

    takeTicket(desktop) {
        if (!this.tickets.length) {
            return null;
        }

        const ticket = this.tickets.shift();

        ticket.desktop = desktop;

        this.lastFour.unshift(ticket);

        if (this.lastFour.length > 4) {
            this.lastFour.splice(-1, 1);
        }

        this.saveDB();

        return ticket;
    }
}
