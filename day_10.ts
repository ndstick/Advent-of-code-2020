import fs from "fs";

namespace Jolts {
    export type Rating = number;
    export const MAX_DIFF = 3;
    export type ArrangementTree = Map<Rating, ArrangementTree>;

    // Using a tree is super duper slow for this kind of problem (building it is fast, but counting all the leaves is sloooooow)
    // Learned that the hard way
    export const buildArrangementTree = (joltRatings: Rating[]): ArrangementTree => {
        const arrangement: ArrangementTree = new Map();

        joltRatings.forEach((rating) => arrangement.set(rating, new Map()));

        for (let i = 0; i < joltRatings.length - 1; i++) {
            for (let j = i + 1; j < joltRatings.length; j++) {
                if (joltRatings[j] - joltRatings[i] > MAX_DIFF) break;
                const current = arrangement.get(joltRatings[i]);
                const next = arrangement.get(joltRatings[j]);

                if (current === undefined || next === undefined)
                    throw new Error("Fetched jolt rating that does not exist in arrangement tree");

                current.set(j, next);
            }
        }

        const prunedArrangement: ArrangementTree = new Map();
        const leaf = arrangement.get(joltRatings[0]);
        if (!leaf) throw new Error("Root jolt rating does not contain downstream jolt ratings");
        prunedArrangement.set(joltRatings[0], leaf);
        return prunedArrangement;
    };

    export const countJoltRatingDifference = (diff: Rating, joltRatings: Rating[]): number => {
        let accumulator = 0;

        for (let i = 0; i < joltRatings.length - 1; i++) {
            if (joltRatings[i + 1] - joltRatings[i] > MAX_DIFF) break;
            if (joltRatings[i] + diff === joltRatings[i + 1]) accumulator++;
        }

        return accumulator;
    };

    export const countArrangementPaths = (arrangement: ArrangementTree, count = 0): number => {
        // console.log('arrangement under consideration', arrangement);
        const entries = Array.from(arrangement.entries());

        if (entries.length === 0) {
            return count + 1;
        }

        let intermediateCount = count;
        for (const [_, value] of entries) {
            intermediateCount += countArrangementPaths(value, count);
        }

        return intermediateCount;
    };

    // This is much faster than counting the leaves on a tree
    export const findContiguousRegions = (ratings: Rating[]): Rating[][] => {
        const contiguousRegions: Rating[][] = [[]];
        for (let i = 0; i < ratings.length - 2; i++) {
            if (ratings[i] + Jolts.MAX_DIFF > ratings[i + 2]) {
                contiguousRegions[contiguousRegions.length - 1].push(ratings[i + 1]);
            } else {
                contiguousRegions.push([]);
            }
        }
        return contiguousRegions.filter((region) => region.length > 0);
    };

    // This is much faster than counting the leaves on a tree
    export const calculateAllPossibleArrangements = (contiguousRegions: Rating[][]): number => {
        let accumulator = 1;
        for (const region of contiguousRegions) {
            if (region.length >= Jolts.MAX_DIFF) {
                const invalidArrangements = region.length - Jolts.MAX_DIFF + 1;
                const allPossibleArrangements = Math.pow(2, region.length);
                accumulator *= allPossibleArrangements - invalidArrangements;
            } else {
                const allPossibleArrangements = Math.pow(2, region.length);
                accumulator *= allPossibleArrangements;
            }
        }
        return accumulator;
    };

    export const sortLowToHigh = (joltRatings: Rating[]): Rating[] => {
        return joltRatings.slice(0).sort((a, b) => a - b);
    };

    export const parseJoltAdapters = (str: string): Rating[] => {
        return str.split("\n").map((joltRating) => parseInt(joltRating));
    };
}

const input = fs.readFileSync("./resources/day_10_jolts.txt").toString();
const joltRatings = Jolts.parseJoltAdapters(input);
const sortedJoltRatings = Jolts.sortLowToHigh(joltRatings);
const joltRatingChainPlugToDevice = [0, ...sortedJoltRatings, sortedJoltRatings[sortedJoltRatings.length - 1] + 3];
console.log({
    differenceOfOne: Jolts.countJoltRatingDifference(1, joltRatingChainPlugToDevice),
    differenceOfThree: Jolts.countJoltRatingDifference(3, joltRatingChainPlugToDevice),
});
// const arrangement = Jolts.buildArrangementTree(joltRatingChainPlugToDevice);
// console.log("paths leading to Rome", Jolts.countArrangementPaths(arrangement));
const contiguousRegions = Jolts.findContiguousRegions(joltRatingChainPlugToDevice);
const allPossibleArrangements = Jolts.calculateAllPossibleArrangements(contiguousRegions);
console.log("arrangements", allPossibleArrangements);
