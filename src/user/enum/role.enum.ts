
export enum Role {
    ADMIN,
    TEACHER,
    STUDENT,
}

export const RoleName: Record<Role, string> = {
    [Role.ADMIN]: "admin",
    [Role.TEACHER]: "teacher",
    [Role.STUDENT]: "student",
}