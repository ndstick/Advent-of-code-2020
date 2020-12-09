import * as fs from "fs";

// console.log(fs.readFileSync("./resources/day_4_passports.txt"))

const splitNonEmpty = (txt: string, pattern: string | RegExp): string[] => {
    return txt.split(pattern).filter((str) => str != "");
};

type PassportTuples = Array<[string, string]>;
const parseText = (text: string): PassportTuples[] => {
    return splitNonEmpty(text, "\n\n").map((passportTxt) => {
        const passwordKeyValuePairs = splitNonEmpty(passportTxt, /\s+/);
        return passwordKeyValuePairs.map((pair: string) => {
            const [key, value] = pair.split(":");
            return [key, value];
        });
    });
};

type Passport = Map<string, string>;
const tuplesToPassport = (tuples: PassportTuples): Passport => {
    const passportMap = new Map<string, string>();
    tuples.forEach(([key, value]) => passportMap.set(key, value));
    return passportMap;
};

namespace Validators {
    type PassportValidator = (passport: Passport) => boolean;

    const byrValidator: PassportValidator = (passport) => {
        const byr = passport.get("byr");
        if (byr === undefined) return false;
        const byrNum = parseInt(byr);
        return byrNum >= 1920 && byrNum <= 2002;
    };

    const iyrValidator: PassportValidator = (passport) => {
        const iyr = passport.get("iyr");
        if (iyr === undefined) return false;
        const iyrNum = parseInt(iyr);
        return iyrNum >= 2010 && iyrNum <= 2020;
    };

    const eyrValidator: PassportValidator = (passport) => {
        const eyr = passport.get("eyr");
        if (eyr === undefined) return false;
        const eyrNum = parseInt(eyr);
        return eyrNum >= 2020 && eyrNum <= 2030;
    };

    const hgtValidator: PassportValidator = (passport) => {
        const hgt = passport.get("hgt");
        if (hgt === undefined) return false;

        const hgtMetric = hgt.slice(hgt.length - 2);
        const hgtValue = parseInt(hgt.slice(0, hgt.length - 2));

        if (hgtMetric !== "in" && hgtMetric !== "cm") return false;
        if (isNaN(hgtValue)) return false;
        if (hgtMetric === "in") {
            return hgtValue >= 59 && hgtValue <= 76;
        }
        if (isNaN(hgtValue)) return false;
        return hgtValue >= 150 && hgtValue <= 193;
    };

    const hclValidator: PassportValidator = (passport) => {
        const hcl = passport.get("hcl");
        if (hcl === undefined) return false;
        if (hcl[0] !== "#") return false;
        if (hcl.slice(1).match(/[a-f0-9]{6}/) === null) return false;
        return true;
    };

    const eclValidator: PassportValidator = (passport) => {
        const validColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
        const ecl = passport.get("ecl");
        if (ecl === undefined) return false;
        return validColors.includes(ecl);
    };

    const pidValidator: PassportValidator = (passport) => {
        const pid = passport.get("pid");
        if (pid === undefined) return false;
        if (pid.length > 9) return false;
        return pid.match(/[0-9]{9}/) !== null;
    };

    const cidValidator: PassportValidator = () => true;

    export const PassportValidator = (): PassportValidator => {
        const validators = [
            byrValidator,
            iyrValidator,
            eyrValidator,
            hgtValidator,
            hclValidator,
            eclValidator,
            pidValidator,
            cidValidator,
        ];

        return (passport) => {
            const validationResults = validators.map((validator) => validator(passport));
            // console.log("passport", passport, validationResults);
            return validationResults.reduce((prev, curr) => prev && curr, true);
        };
    };
}
const count = () => (previous: number) => previous + 1;

// invocation //
const passportsBuffer = fs.readFileSync("./resources/day_4_passports.txt");
const passportsTxt = passportsBuffer.toString();

const passportsAsTuples = parseText(passportsTxt);
const passportsAsMaps = passportsAsTuples.map(tuplesToPassport);
// console.log("passports", passportsAsMaps);
console.log("valid passports", passportsAsMaps.filter(Validators.PassportValidator()).reduce(count(), 0));
