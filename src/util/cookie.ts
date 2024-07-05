import type { Context } from 'koa'
import { decodeCookie, signCookie } from './jwt'

interface Cookie {
    token?: string
}

export function getCookieByContext<K extends keyof Cookie>(
    ctx: Context,
    key: K
): Cookie[K] {
    return ctx.cookies.get(key)
}
export function getSignedCookieByContext<K extends keyof Cookie>(
    ctx: Context,
    key: K
): Cookie[K] {
    return decodeCookie(ctx.cookies.get(key) as string) as Cookie[K]
}

export function setCookieByContext<K extends keyof Cookie>(
    ctx: Context,
    key: K,
    value: NonNullable<Cookie[K]>,
    options?: Parameters<Context['cookies']['set']>[2]
) {
    ctx.cookies.set(key, signCookie(value), {
        ...options,
    })
}
