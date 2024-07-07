import { defaultLogger } from './framework/logger'
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'

const initEnv = () => {
    dotenv.config()
    let dotenvFile = path.resolve(
        '..',
        `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}||''`}`
    )
    defaultLogger.log('process.NODE_ENV: ', process.env.NODE_ENV)
    defaultLogger.log('.env file is loaded')
    if (fs.existsSync(dotenvFile)) {
        dotenv.config({ path: dotenvFile, override: true })
        defaultLogger.log(`${dotenvFile} file is loaded`)
    }
    defaultLogger.debug('envs: ', process.env)
}

initEnv()
export function env<K extends keyof typeof process.env>(
    name: K
): (typeof process.env)[K] {
    console.debug(name, process.env[name])
    return process.env[name]
}
