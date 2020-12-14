import { Commands } from "./command";
import { CommandExecutors } from "./command.executors";
import { UnitVector, Vector } from "./vector";

export namespace Ferry {

    export type State = {
        direction: UnitVector,
        waypoint: Vector,
        position: Vector
    }

    export const Ferry = (): State => ({
        direction: { x: 1, y: 0 }, // East-bound
        position: { x: 0, y: 0 },
        waypoint: { x: 10, y: -1 } // East 1, North 10
    })

    export const updateFerryState = (state: State, command: Commands.Command): State => {
        return CommandExecutors.executors[command.type](state, command);
    };

    export const parseNavigation = (str: string): Commands.Command[] => {
        return str.split("\n").map((command) => {
            return {
                type: command[0],
                value: parseInt(command.slice(1)),
            } as Commands.Command;
        });
    };
}