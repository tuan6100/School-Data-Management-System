
export enum Subject {
    MATH ,
    LITERATURE ,
    ENGLISH ,
    PHYSICS ,
    CHEMISTRY ,
    BIOLOGY ,
    GEOGRAPHY ,
    HISTORY ,
    CIVIC_EDU ,
    COMPUTER_SCIENCE ,
    TECHNOLGY ,
}

export const SubjectNames: Record<Subject, string> = {
    [Subject.MATH]: "math",
    [Subject.LITERATURE]: "literature",
    [Subject.ENGLISH]: "english",
    [Subject.PHYSICS]: "physics",
    [Subject.CHEMISTRY]: "chemistry",
    [Subject.BIOLOGY]: "biology",
    [Subject.GEOGRAPHY]: "geography",
    [Subject.HISTORY]: "history",
    [Subject.CIVIC_EDU]: "civic_edu",
    [Subject.COMPUTER_SCIENCE]: "computer_science",
    [Subject.TECHNOLGY]: "technology"
};