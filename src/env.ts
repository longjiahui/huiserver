import { defaultLogger } from './framework/logger'
import dotenv from 'dotenv'

const initEnv = () => {
    dotenv.config()
    let extraDotEnvFile = `.env${
        process.env.NODE_ENV && `.${process.env.NODE_ENV || ''}`
    }`
    defaultLogger.log('process.NODE_ENV: ', process.env.NODE_ENV)
    defaultLogger.log('.env file is loaded')
    if (extraDotEnvFile) {
        dotenv.config({
            path: extraDotEnvFile,
            override: true,
        })
        defaultLogger.log(`${extraDotEnvFile} file is loaded`)
    }
    defaultLogger.debug('envs: ', process.env)
}

initEnv()

export interface ServerEnv {
    NODE_ENV?: 'development' | 'production'

    JWT_COOKIE_SECRET?: string
}
type Env = ServerEnv
export function env<K extends keyof Env>(name: K): Env[K] {
    return (process.env as ServerEnv)[name]
}
