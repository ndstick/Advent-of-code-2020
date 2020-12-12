import { Commands } from "./command";
import { Ferry } from "./ferry";
import { UnitVector, Vector, Vectors } from "./vector";

export namespace CommandExecutors {
    export type CommandExecutor = (state: Ferry.State, command: Commands.Command) => Ferry.State;

    const horizontalMovementCommandToVector = (command: Commands.Command): Vector => {
        // East is positive, West is negative
        return {
            x: command.type === "E" ? command.value : -command.value,
            y: 0,
        };
    };

    const verticalMovementCommandToVector = (command: Commands.Command): Vector => {
        // North is negative, South is positive
        return {
            x: 0,
            y: command.type === "S" ? command.value : -command.value,
        };
    };

    export const executeVerticalMovementCommand: CommandExecutor = (state, command) => {
        const commandVector = verticalMovementCommandToVector(command);
        return {
            ...state,
            position: Vectors.plus(state.position, commandVector),
        };
    };

    export const executeHorizontalMovementCommand: CommandExecutor = (state, command) => {
        const commandVector = horizontalMovementCommandToVector(command);
        return {
            ...state,
            position: Vectors.plus(state.position, commandVector),
        };
    };

    export const executeRotateCommand: CommandExecutor = (state, command) => {
        const degrees = command.type === "L" ? -command.value : command.value;
        return {
            ...state,
            direction: Vectors.rotate(state.direction, degrees) as UnitVector,
        };
    };

    export const executeForwardMovement: CommandExecutor = (state, command) => {
        const positionShift = Vectors.scalarMultiply(state.direction, command.value);
        return {
            ...state,
            position: Vectors.plus(state.position, positionShift),
        };
    };

    export const executors: { [e in Commands.Command["type"]]: CommandExecutor } = {
        N: executeVerticalMovementCommand,
        S: executeVerticalMovementCommand,
        E: executeHorizontalMovementCommand,
        W: executeHorizontalMovementCommand,
        L: executeRotateCommand,
        R: executeRotateCommand,
        F: executeForwardMovement,
    };
}
