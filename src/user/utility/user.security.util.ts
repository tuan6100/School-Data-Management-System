import {Role} from "../enum/role.enum"
import {hash} from "argon2"
import { createCipheriv, createDecipheriv, scryptSync } from "crypto"
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
    return hash(password, { hashLength: 32})
}


const SECRET_KEY = scryptSync(`${process.env.EMAIL_ENCRYPTION_KEY}`, 'salt', 32)
const FIXED_IV = Buffer.from('0123456789abcdef0123456789abcdef').subarray(0, 16)

export function encryptEmail(email: string): string {
    try {
        const cipher = createCipheriv(
          'aes-256-cbc',
          Buffer.from(SECRET_KEY),
          FIXED_IV
        )
        let encrypted = Buffer.concat([
            cipher.update(email, 'utf8'),
            cipher.final()
        ])
        return encrypted.toString('base64')
    } catch (error) {
        throw new InternalServerErrorException(`Email encryption failed: ${error.message}`)
    }
}

export function decryptEmail(encryptedEmail: string): string {
    try {
        const encryptedData = Buffer.from(encryptedEmail, 'base64')
        const decipher = createDecipheriv(
          'aes-256-cbc',
          Buffer.from(SECRET_KEY),
          FIXED_IV
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

