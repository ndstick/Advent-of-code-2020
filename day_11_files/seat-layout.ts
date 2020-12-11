import { seatRule } from "./rules";
import { Layout } from "./types";

export default class SeatLayout {

    constructor(private readonly layout: Layout) {
    }

    public get state(): Layout {
        return this.layout;
    }

    public nextSeatLayout(): SeatLayout {
        const nextLayout: Layout = [];

        for (let i = 0; i < this.layout.length; i++) {
            if (nextLayout[i] === undefined) nextLayout.push([]);

            const currentRow = this.layout[i];
            const nextRow = nextLayout[i];
            for (let j = 0; j < currentRow.length; j++) {
                nextRow.push(seatRule(this.layout, { x: i, y: j }));
            }
        }

        return new SeatLayout(nextLayout);
    }

    public equals(other: SeatLayout): boolean {

        const otherState = other.state;

        for (let i = 0; i< this.layout.length; i++) {
            const thisLayoutRow = this.layout[i];
            const thatLayoutRow = otherState[i];

            if (thisLayoutRow.length !== thatLayoutRow.length)
                return false;
            
            for (let j = 0; j < thisLayoutRow.length; j++) {
                if (thisLayoutRow[j] !== thatLayoutRow[j])
                    return false;
            }
        }

        return true;
    }
}