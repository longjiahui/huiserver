import { sign as jwtSign, decode as jwtDecode } from 'jsonwebtoken'

const jwtCookieSecret = process.env.JWT_COOKIE_SECRET

export const getAuthFunction = (secret: string) => ({
    sign: (
        data: string | Buffer | object,
        options?: Parameters<typeof jwtSign>[2]
    ) =>
        jwtSign(data, secret, {
            ...(data && typeof data === 'object'
                ? {
                      expiresIn: '30d',
                  }
                : {}),
            ...options,
        }),
    decode: (token: string) => jwtDecode(token),
})

export const { sign: signCookie, decode: decodeCookie } = getAuthFunction(
    jwtCookieSecret!
)
