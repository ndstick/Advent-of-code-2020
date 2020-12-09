import fs from "fs";

class NumberPartition {
    private partitionMap = new Map<number, number[]>();

    constructor(list: number[], private partitionKeyFn: (number: number) => number) {
        list.forEach((item) => {
            const partitionKey = partitionKeyFn(item);
            const partition = this.partitionMap.get(partitionKey);
            if (partition instanceof Array) {
                partition.push(item);
            } else {
                this.partitionMap.set(partitionKeyFn(item), [item]);
            }
        });
    }

    getPartitionKeys(): number[] {
        return Array.from(this.partitionMap.keys());
    }

    getPartition(key: number): number[] {
        return this.getPartitionExact(this.partitionKeyFn(key));
    }

    getPartitionExact(key: number): number[] {
        const partition = this.partitionMap.get(key);
        return partition instanceof Array ? partition : [];
    }

    getBetween(num0: number, num1: number): number[] {
        const pk0 = this.partitionKeyFn(num0);
        const pk1 = this.partitionKeyFn(num1);
        const keys = this.getPartitionKeys();

        const acc: number[] = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (key >= pk0 && key <= pk1) {
                const partition = this.partitionMap.get(key);
                const value = partition ? partition : [];
                acc.push(...value);
            }
        }

        return acc;
    }
}

const findSum2020 = (numbers: number[]): [number, number, number] => {
    const targetNumber = 2020;
    const _numbers = numbers.slice(0).sort((a, b) => a - b);
    const numberPartition = new NumberPartition(_numbers, (number) => Math.floor(number / 100) * 100);
    for (const first of _numbers) {
        const partitionsBetween = numberPartition.getBetween(first, targetNumber);
        for (const second of partitionsBetween) {
            const third = targetNumber - first - second;
            const partition = numberPartition.getPartition(third);
            if (partition.includes(third)) {
                return [first, second, third];
            }
        }
    }
    return [0, 0, 0];
};

const fileContent = fs.readFileSync("./resources/day_1_expense_rapport.txt").toString();
const sum2020 = findSum2020(fileContent.split("\n").map((number) => parseInt(number)));
console.log(sum2020.reduce((a,b) => a*b, 1));
