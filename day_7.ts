import fs from "fs";

namespace Luggage {
    type BagID = string;
    type BagContent = { amount: number; bagId: BagID }[];

    export class BagRule {
        private static context = new Map<BagID, BagRule>();

        constructor(public id: BagID, private content: BagContent) {
            BagRule.context.set(id, this);
        }

        public static getBagRule(bagId: BagID): BagRule {
            const bagRule = BagRule.context.get(bagId);
            if (!bagRule) throw new Error("Not found exception: bagId = " + bagId);
            return bagRule;
        }

        public canContain(other: BagID): boolean {
            if (this.content.map((content) => content.bagId).includes(other)) {
                return true;
            }

            return this.content
                .map((content) => BagRule.getBagRule(content.bagId).canContain(other))
                .reduce((acc, value) => acc || value, false);
        }

        public amountOfBagsContainedWithin(): number {
            console.log(this.toString());
            return this.content
                .map(({ amount, bagId }) => amount + amount * BagRule.getBagRule(bagId).amountOfBagsContainedWithin())
                .reduce((acc, value) => acc + value, 0);
        }

        public toString(): string {
            return `{ id: ${this.id}, content: ${JSON.stringify(this.content)} }`;
        }
    }

    export const parseLuggageRules = (luggageRules: string): BagRule[] => {
        const containRegex = /contain/;

        const regexFind = (str: string, regex: RegExp): string => {
            const matches = str.match(regex);
            if (matches === null) throw new Error("Illegal state exception, cannot parse" + str);
            return Array.from(matches)[0];
        };

        const parseBagIdRule = (bagRule: string): BagID => regexFind(bagRule, /^([a-z]+\s[a-z]+)/);

        const parseBagContentRule = (bagContentRule: string): BagContent => {
            const bagContentMatches = bagContentRule.match(/(\d\s[a-z]+\s[a-z]+)/g);
            return Array.from(bagContentMatches ? bagContentMatches : []).map((contentRule) => {
                return {
                    amount: parseInt(regexFind(contentRule, /\d+/)),
                    bagId: regexFind(contentRule, /[a-z]+\s[a-z]+/),
                };
            });
        };

        return luggageRules.split("\n").map((rule) => {
            const [bag, content] = rule.split(containRegex);
            return new BagRule(parseBagIdRule(bag), parseBagContentRule(content));
        });
    };
}

const input = fs.readFileSync("./resources/day_7_luggage_rules.txt").toString();
const luggageRules = Luggage.parseLuggageRules(input);
const goldenBagHolders = luggageRules.filter((bag) => bag.canContain("shiny gold"));
console.log("Bags that can hold 'shiny gold' bags:", goldenBagHolders.length);
const goldenBag = Luggage.BagRule.getBagRule("shiny gold");
console.log("A shiny golden bag can hold " + goldenBag.amountOfBagsContainedWithin() + " bags!");
