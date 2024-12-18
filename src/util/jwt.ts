import { sign as jwtSign, decode as jwtDecode } from 'jsonwebtoken'
import { env } from '../env'
import { FatalError } from '../error'

const jwtCookieSecret = env('JWT_COOKIE_SECRET')
if (!jwtCookieSecret) {
    throw new FatalError('no JWT_COOKIE_SECRET specified!')
}

export const getAuthFunction = (secret: string) => ({
    sign: (
        data: string | Buffer | object,
        options?: Partial<Parameters<typeof jwtSign>[2]>
    ) =>
        jwtSign(data, secret, {
            ...options,
        }),
    decode: (token: string) => jwtDecode(token),
})

export const { sign: signCookie, decode: decodeCookie } = getAuthFunction(
    jwtCookieSecret!
)
