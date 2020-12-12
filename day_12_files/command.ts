export namespace Commands {
    export type Command = { 
        type: "N" | "E" | "S" | "W" | "L" | "R" | "F"; 
        value: number 
    };
}
