import fs from "fs";

type Password = string;
type PasswordConstraint = { value: string; min: number; max: number };
type PasswordValidator = { isValid(password: string): boolean };

const passwordValidator = (constraint: PasswordConstraint): PasswordValidator => {
    return {
        isValid(password) {
            return (
                password[constraint.min - 1] === constraint.value || password[constraint.max - 1] === constraint.value
            );
        },
    };
};

const parseTemplate = (template: string): Array<[Password, PasswordConstraint]> => {
    return template
        .split("\n")
        .filter((txt) => txt !== "")
        .map((txt) => {
            const [constraint, password] = txt.split(":").map((it) => it.trim());

            const value = Array.from(constraint.match(/([a-zA-Z]+)/) as RegExpMatchArray)[0];
            const [min, max] = Array.from(constraint.match(/(\d+-\d+)/) as RegExpMatchArray)[0].split("-");
            const passwordConstraint: PasswordConstraint = { value, min: parseInt(min), max: parseInt(max) };

            return [password, passwordConstraint];
        });
};

const template = fs.readFileSync("./resources/day_2_password_validations.txt").toString();

const passwordsAndConstraints = parseTemplate(template); //.slice(997, 1000);
const validPasswords = passwordsAndConstraints.filter(([password, constraint]) => {
    return passwordValidator(constraint).isValid(password);
}).length;

console.log(validPasswords);
// fs.writeFileSync(
//     './day_2_result.json',
//     JSON.stringify(
//         passwordsAndConstraints.map(([password, constraint]) => {
//             return {
//                 password,
//                 constraint,
//                 isValid: passwordValidator(constraint).isValid(password)
//             }
//         })
//     )
//     )
// const validPasswords = passwordsAndConstraints.filter(([password, constraint]) =>
//     passwordValidator(constraint).isValid(password)
// ).length;
// console.log("valid passwords", validPasswords);
