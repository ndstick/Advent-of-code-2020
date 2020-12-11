import { occupiedSeatsWithinView } from "./adjacent-seats";
import { Rule } from "./types";

const emptySeatRule: Rule = (layout, point) => {
    const cellValue = layout[point.x][point.y];

    if (cellValue !== "L") {
        throw new Error(`Cell: '${cellValue}' is not an empy seat`);
    }

    const occupiedSeats = occupiedSeatsWithinView(layout, point);
    if (occupiedSeats.length > 0) {
        return cellValue;
    }

    return "#";
};

const occupiedSeatRule: Rule = (layout, point) => {
    const cellValue = layout[point.x][point.y];

    if (cellValue !== "#") {
        throw new Error(`Cell: '${cellValue}' is not an occupied seat`);
    }

    const occupiedSeats = occupiedSeatsWithinView(layout, point);

    if (occupiedSeats.filter((cell) => cell === "#").length >= 5) {
        return "L";
    }

    return cellValue;
};

export const seatRule: Rule = (layout, point) => {
    const cell = layout[point.x][point.y];
    switch (cell) {
        case "#":
            return occupiedSeatRule(layout, point);
        case "L":
            return emptySeatRule(layout, point);
        default:
            return cell;
    }
};
