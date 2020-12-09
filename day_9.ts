import fs from "fs";

namespace XMAS {
    class TapeReader {
        private readonly _tape: number[] = [];
        private finished: boolean = false;

        constructor(capacity: number, private readonly tapeStream: IterableIterator<number>) {
            for (let i = 0; i < capacity; i++) {
                const tapeItem = tapeStream.next();
                if (tapeItem.done) {
                    throw new Error(
                        "Illegal state exception: preamble larger than available elements from tapeStream."
                    );
                }
                this._tape.push(tapeItem.value);
            }
        }

        get isFinished(): boolean {
            return this.finished;
        }

        get tape() {
            return this._tape.slice(0);
        }

        public readNext(): void {
            this.popFirst();
            this.doReadNext();
        }

        private doReadNext() {
            const next = this.tapeStream.next();
            if (next.done) {
                this.finished = true;
            } else {
                this._tape.push(next.value);
            }
        }

        private popFirst() {
            this._tape.reverse();
            this._tape.pop();
            this._tape.reverse();
        }
    }

    export class TapeValidator {
        private readonly tapeReader: TapeReader;
        constructor(private readonly preamble: number, tapeStream: IterableIterator<number>) {
            this.tapeReader = new TapeReader(preamble + 1, tapeStream);
        }

        get tapeSlice(): number[] {
            return this.tapeReader.tape;
        }

        public run(): { faultyNumber: number } | undefined {
            if (this.tapeReader.isFinished) {
                throw new Error("Tape stream has been consumed");
            }

            while (!this.tapeReader.isFinished) {
                const validationResult = this.incrementAndValidate();
                if (validationResult) {
                    return validationResult;
                }
            }
        }

        public incrementAndValidate(): { faultyNumber: number } | undefined {
            const validationError = this.doValidate();
            if (validationError) {
                return validationError;
            }
            this.tapeReader.readNext();
        }

        private doValidate(): { faultyNumber: number } | undefined {
            const tape = this.tapeReader.tape;
            const preamble = tape.slice(0, this.preamble).sort((a, b) => a - b);
            const numberToValidate = tape[tape.length - 1];

            if (
                numberToValidate <= preamble[0] ||
                numberToValidate > preamble[preamble.length - 1] + preamble[preamble.length - 2]
            ) {
                return { faultyNumber: numberToValidate };
            }

            for (const number of preamble) {
                if (preamble.includes(numberToValidate - number)) {
                    return;
                }
            }

            return { faultyNumber: numberToValidate };
        }
    }

    export const parseTape = (str: string): number[] => {
        return str.split("\n").map((num) => parseInt(num));
    };

    export const findContiguous = (cutoff: number, list: number[]): number[] => {
        let contiguous: number[];
        let accumulatedValue: number;

        for (let i = 0; i < list.length - 1; i++) {
            contiguous = [list[i]];
            accumulatedValue = list[i];

            for(let j = i + 1; j < list.length; j++) {
                contiguous.push(list[j]);
                accumulatedValue += list[j];

                if (accumulatedValue === cutoff) 
                    return contiguous;
                if (accumulatedValue > cutoff)
                    break;
            }
        }

        return [];
    }
}

const input = fs.readFileSync("./resources/day_9_xmas_tape.txt").toString();
const xmasTape = XMAS.parseTape(input);
const xmasTapeValidator = new XMAS.TapeValidator(25, xmasTape[Symbol.iterator]());
const validationResult = xmasTapeValidator.run();
console.log("faulty number?", validationResult);

if (!validationResult) {
    throw new Error('There should have been a faulty number...');
}

const contiguous = XMAS.findContiguous(validationResult.faultyNumber, xmasTape);
console.log('contiguous', contiguous);
const sortedContiguous = contiguous.slice(0).sort((a, b) => a - b);
const smallestAndLargest = {
    smallest: sortedContiguous[0],
    largest: sortedContiguous[sortedContiguous.length - 1]
};
console.log(smallestAndLargest.smallest + smallestAndLargest.largest, smallestAndLargest);
