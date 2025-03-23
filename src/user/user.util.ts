import {Role} from "./enum/role.enum"
import {hash} from "argon2"
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from "crypto"
import * as process from 'node:process'
import { InternalServerErrorException } from '@nestjs/common'

export function generateStrongPassword(id: number, role: string) {
    const idLastTwoDigits = (id % 100)
    const ididLastTwoDigitsString = idLastTwoDigits < 10 ? "0" + idLastTwoDigits.toString() : idLastTwoDigits.toString()
    const roleValue = Role[role.toUpperCase()].toString()
    const randomNum = Math.floor(Math.random() * 900) + 100
    const specialChars = "!@#$%^&*"
    const randomSpecial = specialChars.charAt(Math.floor(Math.random() * specialChars.length))
    const baseString = `${ididLastTwoDigitsString}${roleValue}${randomNum}`
    const remainingLength = 12 - baseString.length - 1
    const randomChars = "abcdefghijklmnopqrstuvwxyz"
    let password = baseString
    for (let i = 0;  i < remainingLength; i++) {
        password += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
    }
    const insertPosition = Math.floor(Math.random() * (password.length + 1))
    password = password.slice(0, insertPosition) + randomSpecial + password.slice(insertPosition)
    return password
}

export function encryptPassword(password: string) {
    const salt = randomBytes(16)
    return hash(password, { hashLength: 32, salt })
}

const ALGORITHM = 'aes-256-cbc'
const SECRET_KEY = scryptSync(`${process.env.EMAIL_ENCRYPTION_KEY}`, 'salt', 32)
const IV_LENGTH = 16

export function encryptEmail(email: string): string {
    try {
        const iv = randomBytes(IV_LENGTH)
        const cipher = createCipheriv(
          'aes-256-cbc',
          Buffer.from(SECRET_KEY),
          iv
        )
        let encrypted = Buffer.concat([
            cipher.update(email, 'utf8'),
            cipher.final()
        ])
        return Buffer.concat([iv, encrypted]).toString('base64')
    } catch (error) {
        throw new InternalServerErrorException(`Email encryption failed: ${error.message}`)
    }
}


export function decryptEmail(encryptedEmail: string): string {
    try {
        const encryptedBuffer = Buffer.from(encryptedEmail, 'base64')
        const iv = encryptedBuffer.subarray(0, IV_LENGTH)
        const encryptedData = encryptedBuffer.subarray(IV_LENGTH)
        const decipher = createDecipheriv(
          'aes-256-cbc',
          Buffer.from(SECRET_KEY),
          iv
        )
        let decrypted = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final()
        ])
        return decrypted.toString('utf8')
    } catch (error) {
        throw new InternalServerErrorException(`Email decryption failed: ${error.message}`)
    }

}