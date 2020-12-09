import fs from "fs";

namespace Binary {
    export type BinaryCode = (1 | 0)[];

    export const binaryCodeToDecimalNumber = (code: BinaryCode): number => {
        let accumulator = 0;

        for (let i = 0; i < code.length; i++) {
            if (code[code.length - 1 - i]) {
                accumulator += Math.pow(2, i);
            }
        }

        return accumulator;
    };
}

namespace Seats {
    type SeatRowChar = "F" | "B";
    type SeatColumnChar = "L" | "R";

    export type SeatRow = [SeatRowChar, SeatRowChar, SeatRowChar, SeatRowChar, SeatRowChar, SeatRowChar, SeatRowChar];
    export type SeatColumn = [SeatColumnChar, SeatColumnChar, SeatColumnChar];
    export type SeatCode = { row: SeatRow; column: SeatColumn };
    export type Seat = { row: number; column: number; id: number };

    const isSeatRowChar = (char: string): char is SeatRowChar => {
        return char === "F" || char === "B";
    };

    const isSeatColumnChar = (char: string): char is SeatColumnChar => {
        return char === "L" || char === "R";
    };

    const toSeatRow = (seatRowStr: string): SeatRow => {
        if (seatRowStr.length !== 7) {
            throw new Error("Seat row string length not equal to 7");
        }

        const validatedSeatRow = [...seatRowStr].filter(isSeatRowChar);

        if (validatedSeatRow.length !== 7) {
            throw new Error("Seat row string invalid");
        }

        return validatedSeatRow as SeatRow;
    };

    const toSeatColumn = (seatColumnStr: string): SeatColumn => {
        if (seatColumnStr.length !== 3) {
            throw new Error("Seat column string length not equal to 3");
        }

        const validatedSeatColumn = [...seatColumnStr].filter(isSeatColumnChar);

        if (validatedSeatColumn.length !== 3) {
            throw new Error("Seat column string invalid");
        }

        return validatedSeatColumn as SeatColumn;
    };

    export const toSeatCode = (seatCodeStr: string): SeatCode => {
        if (seatCodeStr.length !== 10) {
            throw new Error("Seat code string length not equal to 10");
        }

        const seatRow = toSeatRow(seatCodeStr.slice(0, 7));
        const seatColumn = toSeatColumn(seatCodeStr.slice(7, 10));
        return { row: seatRow, column: seatColumn };
    };

    const planeSeatRowNumber = (seatRow: SeatRow): number => {
        const seatRowCharToBinaryConverter = (char: string): 1 | 0 => {
            return char === "F" ? 0 : 1;
        };

        return Binary.binaryCodeToDecimalNumber(seatRow.map(seatRowCharToBinaryConverter));
    };

    const planeSeatColumnNumber = (seatColumn: SeatColumn): number => {
        const seatColumnCharToBinaryConverter = (char: string): 1 | 0 => {
            return char === "L" ? 0 : 1;
        };

        return Binary.binaryCodeToDecimalNumber(seatColumn.map(seatColumnCharToBinaryConverter));
    };

    export const planeSeat = (seatCode: SeatCode): Seat => {
        const row = planeSeatRowNumber(seatCode.row);
        const column = planeSeatColumnNumber(seatCode.column);
        return { row, column, id: row * 8 + column };
    };
}

const input: string[] = fs.readFileSync("./resources/day_5_seats.txt").toString().split("\n");

const planeSeats: Seats.Seat[] = input.map(Seats.toSeatCode).map(Seats.planeSeat).sort((a, b) => a.id - b.id);

let missingSeatId: number = 0;

for (let i = 0; i < planeSeats.length - 1; i++) {
    const currentSeatID = planeSeats[i].id;
    const nextSeatID = planeSeats[i + 1].id;

    if (currentSeatID + 1 !== nextSeatID) {
        console.log(currentSeatID, nextSeatID);
        missingSeatId = currentSeatID + 1;
    }
}

console.log('missing seat id', missingSeatId);