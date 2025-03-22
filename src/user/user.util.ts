import {Role} from "./enum/role.enum";
import {hash} from "argon2";
import { randomBytes } from "crypto";

export function generateStrongPassword(id: number, role: string) {
    const idLastTwoDigits = (id % 100)
    const ididLastTwoDigitsString = idLastTwoDigits < 10 ? "0" + idLastTwoDigits.toString() : idLastTwoDigits.toString()
    const roleValue = Role[role.toUpperCase()].toString()
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const specialChars = "!@#$%^&*";
    const randomSpecial = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    const baseString = `${ididLastTwoDigitsString}${roleValue}${randomNum}`;
    const remainingLength = 12 - baseString.length - 1;
    const randomChars = "abcdefghijklmnopqrstuvwxyz";
    let password = baseString;
    for (let i = 0; i < remainingLength; i++) {
        password += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    const insertPosition = Math.floor(Math.random() * (password.length + 1));
    password = password.slice(0, insertPosition) + randomSpecial + password.slice(insertPosition);
    return password;
}

export function encryptPassword(password: string) {
    const salt = randomBytes(16);
    return hash(password, { hashLength: 32, salt });
}