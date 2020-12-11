import SeatLayout from "./seat-layout";
import { Layout, SeatSymbol } from "./types";

export namespace Seats {
    export type SeatValue = SeatSymbol;
    export type SeatsLayout = Layout;

    export const findStableSeatLayout = (layout: Layout): Layout => {
        let currentSeatLayout = new SeatLayout(layout);
        while (true) {
            const nextSeatLayout = currentSeatLayout.nextSeatLayout();

            if (currentSeatLayout.equals(nextSeatLayout)) {
                return nextSeatLayout.state;
            } else currentSeatLayout = nextSeatLayout;
        }
    };

    export const parseSeatLayout = (str: string): Layout => {
        return str.split("\n").map((row) => <SeatSymbol[]>[...row]);
    };
}
