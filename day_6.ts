import fs from "fs";

namespace Sets {
    export const intersect = <T>(set0: Set<T>, set1: Set<T>): Set<T> => {
        return new Set<T>([...set0].filter(item => set1.has(item)));
    };
}

namespace Questionaire {
    export type Question = string;
    export type PositiveAnswers = Set<Question>;

    const QUESTIONS = [..."abcdefghijklmnopqrstuvwxyz"];

    export const parseQuestionAnswersPerGroup = (questionaire: string): Array<PositiveAnswers> => {
        return questionaire
            .split("\n\n")
            .map((group) => group.split(/\s+/g))
            .map((individuals) => {
                return individuals
                    .map((individualQuestions) => new Set([...individualQuestions]))
                    .reduce(Sets.intersect, new Set<Question>(QUESTIONS));
            });
    };
}

const input = fs.readFileSync("./resources/day_6_questionnaire.txt").toString();
const answeredQuestionsPerGroup = Questionaire.parseQuestionAnswersPerGroup(input);
const amountAnsweredQuestionsPerGroup = answeredQuestionsPerGroup.map(
    (answeredQuestions) => Array.from(answeredQuestions.values()).length
);
const totalQuestionsAnswered = amountAnsweredQuestionsPerGroup.reduce((accumulator, amount) => accumulator + amount, 0);

// console.log("answeredQuestionsPerGroup", answeredQuestionsPerGroup);
// console.log("amountAnsweredQuestionsPerGroup", amountAnsweredQuestionsPerGroup);
console.log("totalQuestionsAnswered", totalQuestionsAnswered);
