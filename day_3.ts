import fs from "fs";

type Coordinate = [x: number, y: number];
type CoordinateGenerator = Generator<Coordinate, Coordinate, Coordinate>;
function* coordinateGenerator(start: Coordinate, increment: Coordinate): CoordinateGenerator {
    const [sx, sy] = start;
    const [ix, iy] = increment;

    let current: Coordinate = [sx + ix, sy + iy];
    yield current;

    while (true) {
        current = [current[0] + ix, current[1] + iy];
        yield current;
    }
}

type Geography = { get(x: number, y: number): "." | "#" | undefined };
const geography = (template: string): Geography => {
    const geographyArrayTemplate = template.split("\n");
    const width = geographyArrayTemplate[0].length;
    const height = geographyArrayTemplate.length;

    // console.log("geography template", geographyArrayTemplate);

    return {
        get(x, y) {
            // console.log("tile at: ", [x % width, y % height]);

            if (y >= height) {
                return undefined;
            }

            return <"." | "#" | undefined>geographyArrayTemplate[y % height][x % width]; // coordinates are reversed in the array
        },
    };
};

type Path = Array<"." | "#">;
const generatePath = (geography: Geography, coordinateGenerator: CoordinateGenerator): Path => {
    const path: Path = [];

    while (true) {
        const nextTile = geography.get(...coordinateGenerator.next().value);

        if (nextTile === undefined) {
            break;
        }

        path.push(nextTile);
    }

    return path;
};

const slopes: Coordinate[] = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
];
const treesEncounteredPerSlope = slopes.map((slope) => {
    const _coordinateGenerator = coordinateGenerator([0, 0], slope);
    const _geography = geography(fs.readFileSync("./resources/day_3_geography_template.txt").toString());
    const _path = generatePath(_geography, _coordinateGenerator);
    return { slope, trees: _path.filter((tile) => tile === "#").length};
});
console.log("trees encountered per slope", treesEncounteredPerSlope);
