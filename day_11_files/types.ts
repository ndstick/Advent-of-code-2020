export type SeatSymbol = "L" | "#" | ".";
export type Layout = SeatSymbol[][];
export type Point = { x: number; y: number };
export type Rule = (layout: Layout, position: Point) => SeatSymbol;
