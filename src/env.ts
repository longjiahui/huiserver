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
export function env<K extends keyof typeof process.env>(
    name: K
): (typeof process.env)[K] {
    return process.env[name]
}
