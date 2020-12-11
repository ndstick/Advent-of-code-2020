import { Layout, Point, SeatSymbol } from "./types";

type Direction = Point;

const getCellValue = (layout: Layout, point: Point): SeatSymbol | undefined => {
    const row = layout[point.x];
    if (row === undefined) return undefined;
    else return row[point.y];
};

const vectorPlus = (point: Point, direction: Direction): Point => {
    return {
        x: point.x + direction.x,
        y: point.y + direction.y,
    };
};

const isFirstSeatInDirectionOccupied = (layout: Layout, currentPosition: Point, direction: Direction): boolean => {
    let nextPosition = vectorPlus(currentPosition, direction);

    while (getCellValue(layout, nextPosition) === '.') {
        nextPosition = vectorPlus(nextPosition, direction);
    }

    return getCellValue(layout, nextPosition) === '#';
};

const findOccupiedSeatInDirection = (layout: Layout, point: Point, direction: Direction): SeatSymbol | undefined => {
    if (isFirstSeatInDirectionOccupied(layout, point, direction)) {
        return "#";
    }
    return undefined;
};

const findOccupiedSeatRight = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: 1, y: 0 });
};

const findOccupiedSeatLeft = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: -1, y: 0 });
};

const findOccupiedSeatUp = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: 0, y: -1 });
};

const findOccupiedSeatDown = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: 0, y: 1 });
};

const findOccupiedSeatRightUp = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: 1, y: -1 });
};

const findOccupiedSeatRightDown = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: 1, y: 1 });
};

const findOccupiedSeatLeftUp = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: -1, y: -1 });
};

const findOccupiedSeatLeftDown = (layout: Layout, point: Point): SeatSymbol | undefined => {
    return findOccupiedSeatInDirection(layout, point, { x: -1, y: 1 });
};

export const occupiedSeatsWithinView = (layout: Layout, point: Point): SeatSymbol[] => {
    return <SeatSymbol[]>(
        [
            findOccupiedSeatRight(layout, point),
            findOccupiedSeatLeft(layout, point),
            findOccupiedSeatUp(layout, point),
            findOccupiedSeatDown(layout, point),
            findOccupiedSeatRightUp(layout, point),
            findOccupiedSeatRightDown(layout, point),
            findOccupiedSeatLeftUp(layout, point),
            findOccupiedSeatLeftDown(layout, point),
        ].filter((cell) => cell !== undefined)
    );
};
