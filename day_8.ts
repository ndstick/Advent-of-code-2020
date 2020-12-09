import fs from "fs";

namespace Console {
    export type ProgramState = "in progress" | "finished" | "error";
    export type OPCode = "nop" | "acc" | "jmp";
    export type Instruction = [opcode: OPCode, value: number];
    export type LoopBackDiagnostics = {
        acc: number;
        index: number;
        instruction: Instruction;
        state: ProgramState;
        executionSequence: number[];
    };

    export class Program {
        private accumulator = 0;
        private nextInstructionIndex = 0;

        constructor(private instructions: Instruction[]) {}

        get value(): number {
            return this.accumulator;
        }

        get nextIndex(): number {
            return this.nextInstructionIndex;
        }

        get nextInstruction(): Instruction {
            return this.instructions[this.nextInstructionIndex];
        }

        get state(): ProgramState {
            if (this.nextInstructionIndex > this.instructions.length || this.nextInstructionIndex < 0) {
                return "error";
            }
            if (this.nextInstructionIndex === this.instructions.length) {
                return "finished";
            }
            return "in progress";
        }

        public reset(): void {
            this.accumulator = 0;
            this.nextInstructionIndex = 0;
        }

        public run(): ProgramState {
            while (this.state === "in progress") {
                this.increment();
            }
            return this.state;
        }

        public increment(): void {
            if (this.state === "error") {
                throw new Error(`Program entered error state at index ${this.nextIndex}`);
            }

            this.doExecute(...this.nextInstruction);
        }

        private doExecute(instruction: OPCode, value: number): void {
            switch (instruction) {
                case "acc":
                    this.accumulator += value;
                    this.nextInstructionIndex++;
                    break;
                case "jmp":
                    this.nextInstructionIndex += value;
                    break;
                default:
                    this.nextInstructionIndex++;
                    break;
            }
        }
    }

    export const detectLoopBack = (program: Program): LoopBackDiagnostics => {
        const visitedAddresses: number[] = [];

        while (!visitedAddresses.includes(program.nextIndex) && program.state === "in progress") {
            visitedAddresses.push(program.nextIndex);
            program.increment();
        }

        return {
            acc: program.value,
            index: program.nextIndex,
            instruction: program.nextInstruction,
            state: program.state,
            executionSequence: visitedAddresses,
        };
    };

    export const constructInstructionSequence = (
        instructions: Instruction[],
        executionSequence: number[]
    ): [index: number, opcode: OPCode, value: number][] => {
        return executionSequence.map((instructionIndex) => [instructionIndex, ...instructions[instructionIndex]]);
    };

    export const diagnoseInfiniteLoopOrigin = (instructions: Instruction[]) => {
        const { executionSequence } = detectLoopBack(new Program(instructions));
        const reconstructedExectionSequence = constructInstructionSequence(instructions, executionSequence);
        const nopsAndJmps = reconstructedExectionSequence.filter(instruction => instruction[1] === 'jmp' || instruction[1] === 'nop');

        for (const [index, opcode, value] of nopsAndJmps) {
            const copiedInstructions = instructions.slice(0);
            copiedInstructions[index] = [ opcode === 'jmp' ? 'nop' : 'jmp', value];
            const { state } = detectLoopBack(new Program(copiedInstructions));
            if (state === 'finished') {
                return {
                    instructionIndex: index,
                    opcode,
                    value
                };
            }
        }

        throw new Error("Cannot find infinite loop instruction");
    }

    export const parseInstructions = (input: string): Instruction[] => {
        const isOPCode = (str: string): str is OPCode => {
            return str === "nop" || str === "acc" || str === "jmp";
        };

        const parseOPValue = (str: string): number => {
            return parseInt(str);
        };

        return input.split("\n").map((instructionStr) => {
            const [opcodeStr, opValue] = instructionStr.split(" ");

            if (!isOPCode(opcodeStr)) {
                throw new Error(`OP Code ${opcodeStr} is not a known OP Code`);
            }

            return [opcodeStr, parseOPValue(opValue)];
        });
    };
}

const input = fs.readFileSync("./resources/day_8_instructions.txt").toString();
const instructions = Console.parseInstructions(input);

// step 1
const program = new Console.Program(instructions);
const programDiagnostics = Console.detectLoopBack(program);
console.log({ ...programDiagnostics, executionSequence: ['ignored']});

// step 2
const infiniteLoopCulprit = Console.diagnoseInfiniteLoopOrigin(instructions);
const updatedInstructions = ((culprit) => {
    const copiedInstructions = instructions.slice(0);
    copiedInstructions[culprit.instructionIndex] = [culprit.opcode === 'jmp' ? 'nop': 'jmp', culprit.value];
    return copiedInstructions;
})(infiniteLoopCulprit);

const updatedProgram = new Console.Program(updatedInstructions);
const endState = updatedProgram.run();

if (endState !== 'finished') {
    throw new Error("Program did not finish correctly | state: " + endState);
}

console.log("Program accumulator value", updatedProgram.value);
