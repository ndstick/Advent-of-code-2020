import { Seats } from "./day_11_files/seats";
import fs from "fs";

const occupiedSeats = (layout: Seats.SeatsLayout): number => {
    let acc: number = 0;

    for (const row of layout) {
        for (const cell of row) {
            if (cell === "#") ++acc;
        }
    }

    return acc;
};

const print = (layout: Seats.SeatsLayout): void => {
    for (const row of layout) {
        console.log(row.reduce((acc, element) => acc + element, ""));
    }
};

const input = fs.readFileSync("./resources/day_11_seat_layout.txt").toString();
const initLayout = Seats.parseSeatLayout(input);
const finalLayoutState = Seats.findStableSeatLayout(initLayout);
print(finalLayoutState);
console.log("amount of seats taken: ", occupiedSeats(finalLayoutState));
