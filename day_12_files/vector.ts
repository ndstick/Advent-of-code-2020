import { match } from "assert";

export interface Vector {
    x: number;
    y: number;
}

export interface UnitVector extends Vector {
    x: 1 | 0 | -1;
    y: 1 | 0 | -1;
}

export namespace Vectors {
    export const plus = (a: Vector, b: Vector): Vector => {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
        };
    };

    export const minus = (a: Vector, b: Vector): Vector => {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
        };
    };

    export const inverse = (v: Vector): Vector => {
        return {
            x: -v.x,
            y: -v.y,
        };
    };

    export const scalarMultiply = (v: Vector, scalar: number): Vector => {
        return {
            x: scalar * v.x,
            y: scalar * v.y,
        };
    };

    // degrees: 0 90 180 270 ...
    export const rotate = (v: Vector, degrees: number): Vector => {
        const normalizedDegrees = degrees < 0 ? 360 + degrees % 360 : degrees % 360;

        if (normalizedDegrees === 0) {
            return v;
        } else if (normalizedDegrees === 90) {
            return { x: -v.y , y: v.x };
        } else if (normalizedDegrees === 180) {
            return { x: -v.x, y: -v.y };
        } else {
            return { x: v.y, y: -v.x };
        }
    };
}
