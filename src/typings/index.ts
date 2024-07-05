export * from './helper'

declare module 'koa' {
    interface DefaultContext {
        body: any
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'production'

            JWT_COOKIE_SECRET?: string
        }
    }
}

export {}
