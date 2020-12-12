import fs from "fs";
import { Ferry } from "./day_12_files/ferry";

const input = fs.readFileSync("./resources/day_12_ferry_navigation.txt").toString();
const navigationCommands = Ferry.parseNavigation(input);

const convertState = (state: Ferry.State) => ({
    direction: ((direction) => {
        if (direction.x !== 0) return direction.x > 0 ? "E" : "W";
        return direction.y > 0 ? "S" : "N";
    })(state.direction),
    position: ((position) => {
        const horizontal = position.x > 0 ? "E-" + position.x : "W-" + Math.abs(position.x);
        const vertical = position.y > 0 ? "S-" + position.y : "N-" + Math.abs(position.y);
        return `${vertical} | ${horizontal}`;
    })(state.position),
});

const printState = (state: Ferry.State) => {
    console.log(convertState(state));
};

let state = Ferry.Ferry();
for (const command of navigationCommands) {
    state = Ferry.updateFerryState(state, command);
}
printState(state);